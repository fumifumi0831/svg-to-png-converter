"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const child_process_1 = require("child_process");
async function ensureSharpInstalled() {
    const extensionDir = path.dirname(__dirname);
    const nodeModulesDir = path.join(extensionDir, 'node_modules');
    const sharpPath = path.join(nodeModulesDir, 'sharp');
    if (!fs.existsSync(sharpPath)) {
        try {
            // node_modulesディレクトリが存在しない場合は作成
            if (!fs.existsSync(nodeModulesDir)) {
                fs.mkdirSync(nodeModulesDir, { recursive: true });
            }
            // package.jsonの更新
            const packageJsonPath = path.join(extensionDir, 'package.json');
            let packageJson;
            if (fs.existsSync(packageJsonPath)) {
                packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            }
            else {
                packageJson = {
                    name: "svg-to-png-converter",
                    version: "0.1.7",
                    dependencies: {}
                };
            }
            // sharpモジュールの依存関係を追加
            packageJson.dependencies = packageJson.dependencies || {};
            packageJson.dependencies.sharp = "^0.32.6";
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            // sharpモジュールのインストール
            (0, child_process_1.execSync)('npm install sharp --save', {
                cwd: extensionDir,
                stdio: 'inherit'
            });
            if (!fs.existsSync(sharpPath)) {
                throw new Error('Failed to install sharp module');
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to install sharp module: ${error.message}`);
            throw error;
        }
    }
}
async function activate(context) {
    try {
        await ensureSharpInstalled();
    }
    catch (error) {
        console.error('Failed to ensure sharp is installed:', error.message);
        return;
    }
    console.log('SVG to PNG Converter extension is now active');
    // Register the command
    const command = 'svg-to-png-converter.convertToPng';
    const commandHandler = async (fileUri) => {
        try {
            // Handle different context menu scenarios
            let filePath;
            if (fileUri) {
                const stat = await vscode.workspace.fs.stat(fileUri);
                if (stat.type === vscode.FileType.File) {
                    // Single file was right-clicked
                    if (path.extname(fileUri.fsPath).toLowerCase() === '.svg') {
                        filePath = fileUri.fsPath;
                    }
                    else {
                        vscode.window.showErrorMessage('Selected file is not an SVG file.');
                        return;
                    }
                }
                else if (stat.type === vscode.FileType.Directory) {
                    // Folder was right-clicked, we'll process all SVGs in it
                    const files = await vscode.workspace.fs.readDirectory(fileUri);
                    const svgFiles = files.filter(file => file[1] === vscode.FileType.File && path.extname(file[0]).toLowerCase() === '.svg');
                    if (svgFiles.length === 0) {
                        vscode.window.showErrorMessage('No SVG files found in the selected folder.');
                        return;
                    }
                    // Process multiple files
                    for (const file of svgFiles) {
                        const svgPath = path.join(fileUri.fsPath, file[0]);
                        await convertSvgToPng(svgPath);
                    }
                    vscode.window.showInformationMessage(`Converted ${svgFiles.length} SVG files to PNG.`);
                    return;
                }
            }
            else {
                // Called from command palette or active editor
                const editor = vscode.window.activeTextEditor;
                if (editor && path.extname(editor.document.fileName).toLowerCase() === '.svg') {
                    filePath = editor.document.fileName;
                }
                else {
                    vscode.window.showErrorMessage('No SVG file is currently open.');
                    return;
                }
            }
            if (filePath) {
                await convertSvgToPng(filePath);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error converting SVG to PNG: ${error instanceof Error ? error.message : String(error)}`);
        }
    };
    // Register the command and add it to subscriptions
    const disposable = vscode.commands.registerCommand(command, commandHandler);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
async function convertSvgToPng(svgFilePath) {
    try {
        // Get configuration
        const config = vscode.workspace.getConfiguration('svgToPngConverter');
        const quality = config.get('quality') || 1.0;
        let defaultOutputPath = config.get('defaultOutputPath') || '';
        if (defaultOutputPath && !path.isAbsolute(defaultOutputPath)) {
            // If relative path, make it relative to workspace folder
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders && workspaceFolders.length > 0) {
                defaultOutputPath = path.join(workspaceFolders[0].uri.fsPath, defaultOutputPath);
            }
        }
        // Determine output file path
        const svgFileName = path.basename(svgFilePath, '.svg');
        const svgDirectory = path.dirname(svgFilePath);
        let outputDirectory;
        if (defaultOutputPath) {
            outputDirectory = defaultOutputPath;
        }
        else {
            // Ask user for output directory if not set in settings
            const selectedUri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Output Folder',
                defaultUri: vscode.Uri.file(svgDirectory)
            });
            if (!selectedUri || selectedUri.length === 0) {
                // User cancelled
                return;
            }
            outputDirectory = selectedUri[0].fsPath;
        }
        // Ensure output directory exists
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true });
        }
        const outputPath = path.join(outputDirectory, `${svgFileName}.png`);
        // Read SVG content
        const svgContent = fs.readFileSync(svgFilePath);
        // Ask user for width and height or use default
        const inputWidth = await vscode.window.showInputBox({
            prompt: 'Enter PNG width in pixels (leave empty for original size)',
            placeHolder: 'e.g., 800'
        });
        const inputHeight = await vscode.window.showInputBox({
            prompt: 'Enter PNG height in pixels (leave empty for original size)',
            placeHolder: 'e.g., 600'
        });
        // Parse dimensions
        const width = inputWidth ? parseInt(inputWidth) : undefined;
        const height = inputHeight ? parseInt(inputHeight) : undefined;
        // Convert SVG to PNG using sharp
        let sharpInstance = (0, sharp_1.default)(svgContent);
        if (width || height) {
            sharpInstance = sharpInstance.resize(width, height);
        }
        await sharpInstance.png({ quality: Math.floor(quality * 100) }).toFile(outputPath);
        vscode.window.showInformationMessage(`SVG successfully converted to PNG: ${outputPath}`);
        // Ask if user wants to open the converted file
        const openAction = await vscode.window.showInformationMessage('Do you want to open the converted PNG file?', 'Open', 'No');
        if (openAction === 'Open') {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.file(outputPath));
        }
    }
    catch (error) {
        throw new Error(`Failed to convert SVG to PNG: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getExtensionPath() {
    const homeDir = os.homedir();
    const isCursor = process.env.VSCODE_CWD && process.env.VSCODE_CWD.includes('Cursor.app');
    
    // Cursorの場合は.cursor/extensionsを使用
    if (isCursor) {
        return path.join(homeDir, '.cursor', 'extensions');
    }
    
    // VSCodeの場合は.vscode/extensionsを使用
    return path.join(homeDir, '.vscode', 'extensions');
}

function installSharp() {
    try {
        console.log('Installing sharp module...');
        
        const extensionsDir = getExtensionPath();
        const extensionPattern = 'fumifumi0831.svg-to-png-converter-*';
        
        // 拡張機能のディレクトリを探す
        const extensionDirs = fs.readdirSync(extensionsDir)
            .filter(dir => dir.match(extensionPattern))
            .map(dir => path.join(extensionsDir, dir));
            
        if (extensionDirs.length === 0) {
            throw new Error('Extension directory not found');
        }
        
        const extensionDir = extensionDirs[0]; // 最新のバージョンを使用
        console.log('Installing in:', extensionDir);
        
        // package.jsonの作成または更新
        const packageJsonPath = path.join(extensionDir, 'package.json');
        const packageJson = {
            name: "svg-to-png-converter",
            version: "0.1.4",
            dependencies: {
                "sharp": "^0.32.6"
            }
        };
        
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        
        // sharpモジュールのインストール
        console.log('Installing sharp module...');
        execSync('npm install sharp --save', {
            cwd: extensionDir,
            stdio: 'inherit'
        });
        
        console.log('Sharp module installed successfully!');
    } catch (error) {
        console.error('Failed to install sharp module:', error.message);
        process.exit(1);
    }
}

installSharp(); 
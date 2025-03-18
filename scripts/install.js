const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getExtensionPaths() {
    const homeDir = os.homedir();
    return [
        path.join(homeDir, '.cursor', 'extensions'),
        path.join(homeDir, '.vscode', 'extensions')
    ];
}

async function installSharp() {
    try {
        console.log('Starting sharp module installation...');
        
        // 現在のディレクトリを確認
        const currentDir = process.cwd();
        console.log('Current directory:', currentDir);
        
        // まず現在のディレクトリでインストールを試みる
        try {
            console.log('Attempting to install sharp in current directory...');
            execSync('npm install sharp --save', {
                stdio: 'inherit'
            });
            console.log('Sharp installed successfully in current directory');
            return;
        } catch (error) {
            console.log('Failed to install in current directory, trying extension directories...');
        }

        // 拡張機能のディレクトリを探す
        const extensionPaths = getExtensionPaths();
        for (const extensionsDir of extensionPaths) {
            if (!fs.existsSync(extensionsDir)) {
                console.log(`Directory does not exist: ${extensionsDir}`);
                continue;
            }

            const extensionPattern = 'fumifumi0831.svg-to-png-converter-*';
            const extensionDirs = fs.readdirSync(extensionsDir)
                .filter(dir => dir.match(extensionPattern))
                .map(dir => path.join(extensionsDir, dir));

            for (const extensionDir of extensionDirs) {
                console.log('Attempting installation in:', extensionDir);
                
                try {
                    // node_modulesディレクトリが存在しない場合は作成
                    const nodeModulesDir = path.join(extensionDir, 'node_modules');
                    if (!fs.existsSync(nodeModulesDir)) {
                        fs.mkdirSync(nodeModulesDir, { recursive: true });
                    }

                    // package.jsonの更新
                    const packageJsonPath = path.join(extensionDir, 'package.json');
                    const packageJson = {
                        name: "svg-to-png-converter",
                        version: "0.1.5",
                        dependencies: {
                            "sharp": "^0.32.6"
                        }
                    };
                    
                    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

                    // sharpモジュールのインストール
                    execSync('npm install sharp --save', {
                        cwd: extensionDir,
                        stdio: 'inherit'
                    });

                    console.log(`Sharp installed successfully in: ${extensionDir}`);
                } catch (error) {
                    console.error(`Failed to install in ${extensionDir}:`, error.message);
                }
            }
        }

        console.log('Installation process completed');
    } catch (error) {
        console.error('Installation failed:', error.message);
        process.exit(1);
    }
}

installSharp(); 
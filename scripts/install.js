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
        
        // 拡張機能のディレクトリを探す
        const extensionPaths = getExtensionPaths();
        let installed = false;

        for (const extensionsDir of extensionPaths) {
            if (!fs.existsSync(extensionsDir)) {
                console.log(`Directory does not exist: ${extensionsDir}`);
                continue;
            }

            const extensionPattern = 'fumifumi0831.svg-to-png-converter-*';
            const extensionDirs = fs.readdirSync(extensionsDir)
                .filter(dir => dir.match(extensionPattern))
                .map(dir => path.join(extensionsDir, dir))
                .sort((a, b) => {
                    // バージョン番号でソート（最新版を優先）
                    const versionA = a.match(/\d+\.\d+\.\d+$/)?.[0] || '0.0.0';
                    const versionB = b.match(/\d+\.\d+\.\d+$/)?.[0] || '0.0.0';
                    return versionB.localeCompare(versionA);
                });

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
                    let packageJson;
                    
                    if (fs.existsSync(packageJsonPath)) {
                        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                    } else {
                        packageJson = {
                            name: "svg-to-png-converter",
                            version: "0.1.6",
                            dependencies: {}
                        };
                    }

                    // sharpモジュールの依存関係を追加
                    packageJson.dependencies = packageJson.dependencies || {};
                    packageJson.dependencies.sharp = "^0.32.6";
                    
                    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

                    // node_modulesを削除して再インストール
                    if (fs.existsSync(nodeModulesDir)) {
                        fs.rmSync(nodeModulesDir, { recursive: true, force: true });
                    }
                    fs.mkdirSync(nodeModulesDir, { recursive: true });

                    // sharpモジュールのインストール
                    execSync('npm install sharp --save', {
                        cwd: extensionDir,
                        stdio: 'inherit'
                    });

                    // インストールの確認
                    const sharpPath = path.join(nodeModulesDir, 'sharp');
                    if (fs.existsSync(sharpPath)) {
                        console.log(`Sharp installed successfully in: ${extensionDir}`);
                        installed = true;
                        break;
                    } else {
                        console.error(`Sharp module not found after installation in: ${extensionDir}`);
                    }
                } catch (error) {
                    console.error(`Failed to install in ${extensionDir}:`, error.message);
                }
            }

            if (installed) break;
        }

        if (!installed) {
            throw new Error('Failed to install sharp module in any location');
        }

        console.log('Installation process completed successfully');
    } catch (error) {
        console.error('Installation failed:', error.message);
        process.exit(1);
    }
}

installSharp(); 
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function installSharp() {
    try {
        console.log('Installing sharp module...');
        
        // Get the extension installation directory
        const extensionDir = __dirname.replace(path.join('scripts'), '');
        
        // Create package.json if it doesn't exist
        const packageJsonPath = path.join(extensionDir, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            const packageJson = {
                name: "svg-to-png-converter",
                version: "0.1.3",
                dependencies: {
                    "sharp": "^0.32.6"
                }
            };
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        }

        // Install sharp with platform-specific binaries
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
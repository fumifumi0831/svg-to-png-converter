# SVG to PNG Converter

A Visual Studio Code extension that makes it easy to convert SVG files to PNG format. Perfect for developers and designers who need to quickly convert vector graphics to raster format.

![Feature Overview - Convert SVG files to PNG with ease](https://raw.githubusercontent.com/fumifumi0831/svg-to-png-converter/main/images/feature-overview.png)

## Features

✨ **Simple Conversion**
- Convert SVG files to PNG with just a right-click
- Batch convert all SVG files in a folder
- Preview option after conversion

![Context Menu - Easy access to conversion options](https://raw.githubusercontent.com/fumifumi0831/svg-to-png-converter/main/images/context-menu.png)

🎨 **Customization Options**
- Specify custom output dimensions
- Adjust PNG quality (0.1 to 1.0)
- Choose custom output location or set default path

![Settings - Configure quality and default output path](https://raw.githubusercontent.com/fumifumi0831/svg-to-png-converter/main/images/settings.png)

⚡ **Fast and Efficient**
- Built with the high-performance Sharp library
- Minimal memory usage
- Supports batch processing

## Installation

1. Open VS Code
2. Press `Ctrl+P` (`Cmd+P` on macOS)
3. Type `ext install fumifumi0831.svg-to-png-converter`
4. Press Enter

## Usage

### Single File Conversion
1. Right-click on an SVG file in the Explorer
2. Select "Convert SVG to PNG"
3. Choose output folder (if no default set)
4. Optionally specify dimensions
5. PNG file will be created in the selected location

### Batch Conversion
1. Right-click on a folder containing SVG files
2. Select "Convert SVG to PNG"
3. Choose output folder
4. All SVG files will be converted while maintaining the original file names

### From Command Palette
1. Press `Ctrl+Shift+P` (`Cmd+Shift+P` on macOS)
2. Type "Convert SVG to PNG"
3. Press Enter
4. Select the SVG file to convert

## Extension Settings

This extension contributes the following settings:

* `svgToPngConverter.quality`: Quality of the PNG output (0.1 to 1.0)
  - Default: 1.0
  - Higher values mean better quality but larger file size

* `svgToPngConverter.defaultOutputPath`: Default output path for converted PNG files
  - Can be absolute or relative to workspace
  - Leave empty to choose location each time

## Requirements

- Visual Studio Code 1.60.0 or higher
- No additional software required - all dependencies are included

## Known Issues

- Very large SVG files may take longer to process
- Some complex SVG filters might not render exactly as in vector format
- Files with external references may not convert correctly

## Troubleshooting

If you encounter any issues:
1. If the extension is not responding:
   - Uninstall the extension
   - Run `code --install-extension svg-to-png-converter-0.1.2.vsix` in terminal
   - Or reinstall from the marketplace and reload VS Code
2. Check the output dimensions are within reasonable limits
3. Ensure the SVG file is valid and can be opened in VS Code
4. Verify you have write permissions in the output directory
5. Try adjusting the quality setting if the output file is too large

## Release Notes

### 0.1.2 (2024-03-19)
- Fixed installation issues with sharp module
- Added postinstall script for better compatibility
- Updated troubleshooting guide

### 0.1.1 (2024-03-19)
- Added extension icon
- Improved documentation with screenshots
- Enhanced marketplace presentation
- Added keywords for better discoverability

### 0.1.0 (2024-03-18)
- Initial release
- Basic SVG to PNG conversion
- Folder batch processing
- Quality and output path settings

## Contributing

Found a bug or have a feature request? Please open an issue on our [GitHub repository](https://github.com/fumifumi0831/svg-to-png-converter).

## License

This extension is licensed under the [MIT License](LICENSE.md).

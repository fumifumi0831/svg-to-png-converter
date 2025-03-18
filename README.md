# SVG to PNG Converter

A Visual Studio Code extension that makes it easy to convert SVG files to PNG format. Perfect for developers and designers who need to quickly convert vector graphics to raster format.

![Feature Overview](https://raw.githubusercontent.com/fumifumi0831/svg-to-png-converter/main/images/feature-overview.png)

## Features

### 🎯 Simple Conversion

- Convert SVG files to PNG with just a right-click
- Batch convert all SVG files in a folder
- Preview option before conversion

![Single File Conversion Demo](https://github.com/fumifumi0831/svg-to-png-converter/raw/main/images/one_image_converter.gif)

### 🎨 Customization Options

- Specify output dimensions
- Adjust PNG quality (0.1 to 1.0)
- Set default output location

![Settings](https://raw.githubusercontent.com/fumifumi0831/svg-to-png-converter/main/images/settings.png)

### ⚡ Fast and Efficient

- Built with high-performance Sharp library
- Minimal memory usage
- Batch processing support

![Batch Conversion Demo](https://github.com/fumifumi0831/svg-to-png-converter/raw/main/images/malti_image_converter.gif)

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

* `svgToPngConverter.quality`: Quality of the PNG output (0.1 to 1.0)

  - Default: 1.0
  - Higher values mean better quality but larger file size
* `svgToPngConverter.defaultOutputPath`: Default output path for converted PNG files

  - Can be absolute or relative to workspace
  - Leave empty to choose location each time

## Requirements

- Visual Studio Code 1.60.0 or higher
- No additional software required - all dependencies are included

## Troubleshooting

### Module not found error

If you encounter a "Cannot find module 'sharp'" error:

1. Uninstall the extension
2. Restart VS Code
3. Install the extension again

If the problem persists:

```bash
cd ~/.vscode/extensions/fumifumi0831.svg-to-png-converter-*
npm install sharp --save
```

Then restart VS Code.

### Platform-specific issues

- Ensure Node.js 14.0.0 or higher is installed
- Check write permissions in the extension directory
- Windows users need Visual C++ runtime installed

## Known Issues

- Large SVG files may take longer to process
- Some complex SVG filters might not render exactly as in vector format
- Files with external references may not convert correctly

## Release Notes

### 1.0.0 (2024-03-18)

- Initial stable release
- Fast conversion engine
- Batch processing support
- Preview functionality
- Customizable settings

## Feedback

Found a bug or have a feature request? Please open an issue on our [GitHub repository](https://github.com/fumifumi0831/svg-to-png-converter/issues).

## License

This extension is licensed under the [MIT License](LICENSE.md).

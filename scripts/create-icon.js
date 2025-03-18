const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVGファイルを読み込んでPNGに変換
sharp(path.join(__dirname, '../images/icon.svg'))
    .resize(128, 128)
    .png()
    .toFile(path.join(__dirname, '../images/icon.png'))
    .then(info => console.log('Icon created successfully:', info))
    .catch(err => console.error('Error creating icon:', err)); 
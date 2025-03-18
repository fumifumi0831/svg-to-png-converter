const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
    {
        input: 'icon.svg',
        output: 'icon.png',
        width: 128,
        height: 128
    },
    {
        input: 'feature-overview.svg',
        output: 'feature-overview.png',
        width: 800,
        height: 400
    },
    {
        input: 'context-menu.svg',
        output: 'context-menu.png',
        width: 400,
        height: 300
    },
    {
        input: 'settings.svg',
        output: 'settings.png',
        width: 600,
        height: 300
    }
];

async function convertImages() {
    for (const image of images) {
        try {
            await sharp(path.join(__dirname, '../images', image.input))
                .resize(image.width, image.height)
                .png()
                .toFile(path.join(__dirname, '../images', image.output));
            console.log(`Created ${image.output} successfully`);
        } catch (err) {
            console.error(`Error creating ${image.output}:`, err);
        }
    }
}

convertImages(); 
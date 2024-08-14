const fs = require('fs');
const path = require('path');

const getTagsFromFileNames = (files) => {
    return files.map(file => {
        const fileName = path.basename(file, '.js');
        return {
            name: fileName.charAt(0).toUpperCase() + fileName.slice(1),
            description: `${fileName} operations`,
        };
    });
};

const generateTags = (routesDir) => {
    const tagFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));
    return getTagsFromFileNames(tagFiles);
};

module.exports = {
    generateTags,
};

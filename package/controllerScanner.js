const fs = require('fs');
const glob = require('glob');

function scanControllerForParameters(controllersPath) {
    const parameters = {};

    glob.sync(`${controllersPath}/**/*.js`).forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        // Regex to match destructuring assignments from req.body
        const bodyParamRegex = /const\s+{\s*(.*?)\s*}\s*=\s*req\.body;/g;
        let bodyMatch;
        while ((bodyMatch = bodyParamRegex.exec(content)) !== null) {
            const params = bodyMatch[1].split(',').map(param => param.trim());
            parameters[file] = parameters[file] || { bodyParams: [], urlParams: [], queryParams: [] };
            parameters[file].bodyParams.push(...params);
        }

        // Regex to match variable assignments from req.params
        const paramsRegex = /const\s+(\w+)\s*=\s*req\.params;/g;
        let paramsMatch;
        while ((paramsMatch = paramsRegex.exec(content)) !== null) {
            const param = paramsMatch[1].trim();
            parameters[file] = parameters[file] || { bodyParams: [], urlParams: [], queryParams: [] };
            parameters[file].urlParams.push(param);
        }

        // Regex to match variable assignments from req.query
        const queryRegex = /const\s+(\w+)\s*=\s*req\.query;/g;
        let queryMatch;
        while ((queryMatch = queryRegex.exec(content)) !== null) {
            const query = queryMatch[1].trim();
            parameters[file].queryParams.push(query);
        }
    });

    return parameters;
}

module.exports = scanControllerForParameters;

const generateSwaggerJson = require('./swaggerGenerator');
const { generateTags } = require('./utils');

function autoSwaggerGenerator(options = {}) {
    const controllersPath = options.controllersPath || 'controllers';
    const outputPath = options.outputPath || 'swagger.json';
    const tagsDir = options.routesDir || 'routes';
    const tags = generateTags(tagsDir);

    return (req, res, next) => {
        generateSwaggerJson(controllersPath, outputPath, tags);
        next();
    };
}

module.exports = autoSwaggerGenerator;

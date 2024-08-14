const fs = require('fs');
const scanControllerForParameters = require('./controllerScanner');
const scanRoutes = require('./routeScanner');

function generateSwaggerJson(controllersPath, outputPath, tags = []) {
    const routes = scanRoutes(controllersPath);
    const controllerParameters = scanControllerForParameters(controllersPath);

    const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
            title: 'Generated API',
            version: '1.0.0',
        },
        paths: {},
        components: {
            schemas: {},
        },
        tags: tags,
    };

    routes.forEach(route => {
        const { method, route: path, swaggerComment, controllerFile } = route;
        const parameters = controllerParameters[controllerFile] || {};

        if (!swaggerDefinition.paths[`/${path}`]) {
            swaggerDefinition.paths[`/${path}`] = {};
        }

        const pathItem = swaggerComment ? {
            summary: `Generated for ${method} /${path}`,
            description: swaggerComment,
        } : {
            summary: `Generated for ${method} /${path}`,
            description: `Automatically generated description for ${method} /${path}`,
            parameters: [],
        };

        // Add parameters to the path item if no swagger comment exists
        if (!swaggerComment) {
            if (parameters.bodyParams.length > 0) {
                const schemaName = `${path.replace(/\//g, '_')}_Body`;
                swaggerDefinition.components.schemas[schemaName] = {
                    type: 'object',
                    required: parameters.bodyParams,
                    properties: {},
                };

                parameters.bodyParams.forEach(param => {
                    swaggerDefinition.components.schemas[schemaName].properties[param] = {
                        type: 'string', // Assuming all body params are strings
                        description: `Auto-detected body parameter ${param}`,
                    };
                });

                pathItem.requestBody = {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/${schemaName}`,
                            },
                        },
                    },
                };
            }

            if (parameters.urlParams.length > 0) {
                parameters.urlParams.forEach(param => {
                    pathItem.parameters.push({
                        name: param,
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string', // Assuming all URL params are strings
                        },
                        description: `Auto-detected URL parameter ${param}`,
                    });
                });
            }

            if (parameters.queryParams.length > 0) {
                parameters.queryParams.forEach(query => {
                    pathItem.parameters.push({
                        name: query,
                        in: 'query',
                        required: true,
                        schema: {
                            type: 'string', // Assuming all query params are strings
                        },
                        description: `Auto-detected query parameter ${query}`,
                    });
                });
            }
        }

        swaggerDefinition.paths[`/${path}`][method.toLowerCase()] = pathItem;
    });

    fs.writeFileSync(outputPath, JSON.stringify(swaggerDefinition, null, 2));
    console.log('swagger.json generated successfully at', outputPath);
}

module.exports = generateSwaggerJson;

const fs = require('fs');
const glob = require('glob');

function scanRoutes(controllersPath) {
    const routes = [];

    glob.sync(`${controllersPath}/**/*.js`).forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        // Regex to match Express routes (GET, POST, etc.)
        const routeRegex = /app\.(get|post|put|delete|patch)\('\/(.+?)'/g;
        let match;

        while ((match = routeRegex.exec(content)) !== null) {
            const method = match[1].toUpperCase();
            const route = match[2];

            // Check for Swagger comments above the route
            const commentRegex = new RegExp(`\\/\\*\\*(.*?)\\*\\/\\s*app\\.${method.toLowerCase()}\\('${route}'`, 's');
            const commentMatch = commentRegex.exec(content);

            routes.push({
                method,
                route,
                swaggerComment: commentMatch ? commentMatch[1].trim() : null,
                controllerFile: file
            });
        }
    });

    return routes;
}

module.exports = scanRoutes;

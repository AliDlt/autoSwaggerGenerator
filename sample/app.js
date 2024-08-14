const express = require('express');
const autoSwaggerGenerator = require('path-to-package');

const app = express();

app.use(autoSwaggerGenerator({
    controllersPath: './controllers',
    outputPath: './swagger.json',
    routesDir: './routes',
}));

// Define routes and controllers in the controllers directory

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

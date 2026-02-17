import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const loadSwaggerSpec = () => {
    try {
        const bundledPath = path.join(process.cwd(), 'api-docs', 'bundled.yaml');
        const mainPath = path.join(process.cwd(), 'api-docs', 'main.yaml');

        // Use bundled file if it exists, otherwise fall back to main (main will be incomplete without bundling)
        const filePath = fs.existsSync(bundledPath) ? bundledPath : mainPath;

        const fileContent = fs.readFileSync(filePath, 'utf8');
        return yaml.load(fileContent) as any;
    } catch (error) {
        console.error('Failed to load Swagger specification:', error);
        return {};
    }
};

export const swaggerSpec = loadSwaggerSpec();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './utils/logger';
import { tenantMiddleware } from './middleware/tenant.middleware';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middleware/error.middleware';

import routes from './routes/index';

const app: Express = express();



app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger Documentation (Public)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req: Request, res: Response) => {
    res.json(swaggerSpec);
});

app.use(tenantMiddleware);


// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('Recruiter Service API is running...');
});

app.use('/api/v1', routes);

// Error Handling Middleware (Must be last)
app.use(errorHandler);

export default app;

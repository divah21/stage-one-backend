import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import config from './config/index.js';
import swaggerSpec from './config/swagger.js';
import stringRoutes from './routes/stringRoutes.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (config.allowedOrigins.indexOf(origin) !== -1 || config.nodeEnv === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.set('trust proxy', 1);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'String Analysis API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/', stringRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'String Analysis API',
    version: '1.0.0',
    endpoints: {
      create_string: 'POST /strings',
      get_string: 'GET /strings/{string_value}',
      get_all_strings: 'GET /strings',
      filter_natural_language: 'GET /strings/filter-by-natural-language?query=...',
      delete_string: 'DELETE /strings/{string_value}',
      health: 'GET /health'
    },
    documentation: {
      swagger_ui: '/api-docs',
      openapi_spec: '/api-docs.json',
      readme: 'See README.md for full API documentation'
    }
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

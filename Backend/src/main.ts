import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const expressApp = express();
  
  // Serve static files from uploads directory
  expressApp.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  
  // Enable CORS - Allow all local network origins
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      // Allow localhost and local network IPs
      const allowedOrigins = [
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/,
        /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
        /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
        /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:\d+$/
      ];
      
      const isAllowed = allowedOrigins.some(pattern => pattern.test(origin));
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });
  
  // Enable validation with less strict settings
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false, // Allow unknown properties
    forbidNonWhitelisted: false, // Don't forbid unknown properties
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('InvestFarm API')
    .setDescription('Complete API documentation for InvestFarm agricultural platform')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('products', 'Product management endpoints')
    .addTag('services', 'Service management endpoints')
    .addTag('orders', 'Order management endpoints')
    .addTag('lands', 'Land management endpoints')
    .addTag('equipment', 'Equipment management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'InvestFarm API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2e7d32 !important; }
      .swagger-ui .scheme-container { background: #f5f5f5 !important; }
    `,
  });

  console.log('🚀 InvestFarm API is running on: http://localhost:3002');
  console.log('📚 Swagger documentation: http://localhost:3002/api');
  
  await app.listen(3002);
}
bootstrap(); 
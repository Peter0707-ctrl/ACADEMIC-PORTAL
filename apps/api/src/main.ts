import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';

  // Apply Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Handled per-view or on web proxy
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      hidePoweredBy: true,
      hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
      noSniff: true,
      xssFilter: true,
    }),
  );

  // Hardened CORS Configuration
  const allowedOriginsEnv = process.env.CORS_ORIGIN;
  const defaultDevOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:4000',
  ];
  const allowedOrigins = allowedOriginsEnv
    ? allowedOriginsEnv.split(',').map((o) => o.trim())
    : defaultDevOrigins;

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, mobile native)
      if (!origin) return callback(null, true);
      if (!isProduction || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-Tenant-ID'],
  });

  // Global API Versioning Prefix
  app.setGlobalPrefix('api/v1');

  // Global DTO Validation Pipe with strict whitelisting
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // OpenAPI / Swagger Documentation (conditional in production)
  const isSwaggerEnabled = !isProduction || process.env.ENABLE_SWAGGER === 'true';
  if (isSwaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Universal Education Management Platform API')
      .setDescription(
        'Enterprise-grade multi-tenant Academic Digital Operating System with configurable workflows',
      )
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.log(`OpenAPI documentation is available at /api/docs`);
  } else {
    logger.log('OpenAPI documentation disabled in production (set ENABLE_SWAGGER=true to enable)');
  }

  // Bind to 0.0.0.0 and dynamic PORT for Railway and Cloud Container environments
  const port = process.env.PORT || process.env.API_PORT || 4000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Universal Academic API is running on port ${port} (0.0.0.0)`);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import './polyfill';
import { Logger } from './common/utils/logger';
import helmet from 'helmet';
// import { RolesGuard } from './common/guards/roles.guard';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
    app.enableCors({
    origin: [
      'http://localhost:8000', // for development
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });


  // Enable Helmet for security
  app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", 'data:', 'https:'],
        "script-src": ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginEmbedderPolicy: false, // disable if using cross-origin media
  })
);


  // Cookie parser middleware
  app.use(cookieParser());

  // Logger middleware
  // app.use(LoggerMiddleware);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('🌍 Tourism Management System API')
      .setDescription(
        `
Welcome to the **Tourism Management System API**! 🧳✨

This API powers a platform for:

🚀 Booking tour packages  
📩 Handling inquiries  
🧾 Managing payments  
🎫 Issuing tickets  
📝 Collecting reviews  
👤 Supporting both registered and guest users  

---

🔐 **Authentication**  
Use the **Bearer Token** to authenticate. Most endpoints require valid JWT access tokens.

📚 **Resources**  
Each module (Bookings, Tours, Users, Payments, etc.) is tagged for easy navigation. Happy building! 🔧

📈 API Version: \`1.0\`
`,
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
        },
        'access-token', // Custom name for Swagger UI
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api-docs', app, document, {
      jsonDocumentUrl: '/api-docs-json',
      customSiteTitle: '🌐 Tourism API Docs',
      customfavIcon: 'https://cdn-icons-png.flaticon.com/512/1975/1975728.png', // Optional favicon
      customCss: `
      .topbar-wrapper img { content:url('https://cdn-icons-png.flaticon.com/512/3079/3079120.png'); height: 40px; }
      .swagger-ui .topbar { background-color: #003049; }
      .swagger-ui .info hgroup.main > h2, 
      .swagger-ui .info hgroup.main > h1 { color: #003049; font-weight: bold; }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { background-color: #2a9d8f; }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { background-color: #0077b6; }
      .swagger-ui .opblock.opblock-delete .opblock-summary-method { background-color: #d62828; }
      .swagger-ui .opblock.opblock-put .opblock-summary-method { background-color: #f77f00; }
      .swagger-ui .btn.execute { background-color: #264653; border-color: #264653; }
    `,
    });
  }

  const configService = app.get(ConfigService);
  // Start the application
  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  Logger.info(`Application is running on: http://localhost:${port}`);
}

bootstrap();

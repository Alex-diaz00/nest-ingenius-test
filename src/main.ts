import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setup } from './setup';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Test Example')
    .setDescription('')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  setup(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

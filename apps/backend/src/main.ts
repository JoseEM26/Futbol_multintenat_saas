import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { execSync } from 'child_process';
import * as path from 'path';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  try {
    const dbPath = path.resolve(process.cwd(), '../../packages/database');
    console.log('🔄 Sincronizando base de datos automáticamente...');
    execSync('npx prisma db push --accept-data-loss', { cwd: dbPath, stdio: 'inherit' });
    console.log('✅ Base de datos sincronizada!');
  } catch (error: any) {
    console.warn('⚠️ No se pudo sincronizar la base de datos automáticamente. Revisa si PostgreSQL está encendido.', error.message);
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Para Next.js
  
  // Usar el filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

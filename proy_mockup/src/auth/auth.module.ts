import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env', // 👈 Asegura la carga explícita del .env
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }), // 👈 Estrategia por defecto
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET no configurado en .env');
        }
        return {
          secret,
          signOptions: { expiresIn: '1d', algorithm: 'HS256'},
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
    Reflector,
    RolesGuard,
  ],
  exports: [
    JwtModule, // ✅ Exporta el JwtModule configurado
    PassportModule, // 👈 Opcional: si otros módulos necesitan autenticación
  ],
})
export class AuthModule {}

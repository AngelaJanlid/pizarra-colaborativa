import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule} from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';


import { APP_GUARD } from '@nestjs/core'; // Importa APP_GUARD
import { JwtAuthGuard } from './auth/jwt-auth.guard'; 
import { RolesGuard } from './auth/roles.guard'; 
import { MockupModule } from './mockup/mockup.module';
import { MockupController } from './mockup/mockup.controller';
import { MockupService } from './mockup/mockup.service';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, MockupModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({  // Configuración global del JWT
      secret: process.env.JWT_SECRET,  // Clave secreta desde .env
      signOptions: { expiresIn: '1h' },  // Expira en 1 hora
    }),

  ],
  controllers: [AppController, MockupController],
  providers: [AppService, MockupService,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Este se ejecuta primero
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Este segundo
    },

  ],
})
export class AppModule {}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './decorators/public.decorator'; 

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Permitir solicitudes OPTIONS (preflight CORS)
    if (request.method === 'OPTIONS') {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) return true;

    const token = this.extractToken(request);

    if (!token) {
      // Solo lanzar error si no es una ruta de health check o similar
      if (!this.isHealthCheckRoute(request)) {
        throw new UnauthorizedException('Token no proporcionado');
      }
      return false;
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  private extractToken(request: any): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  private isHealthCheckRoute(request: any): boolean {
    const healthRoutes = ['/health', '/status', '/favicon.ico'];
    return healthRoutes.includes(request.url);
  }
}
/*import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY} from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();

    const userRoles = request.user; // Si no hay roles, asigna array vacío

    return requiredRoles.some(role => userRoles.includes(role));
  }
}*/

// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;
  
    const { user } = context.switchToHttp().getRequest();
    //console.log('User en RolesGuard:', user); // ¡Verifica esto!
    
    if (!user) throw new UnauthorizedException('Usuario no autenticado');
    
    return requiredRoles.includes(user.role); // "role" en singular
  }
}
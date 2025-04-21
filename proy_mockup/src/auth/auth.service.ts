import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';



@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ){}

  /*  async signToken(userId: number, email: string, role: string){
        const payload = { sub: userId, email, role};
        return{
            access_token: this.jwrService.sign(payload),
        }
    }*/


    async register(email: string, password: string){

        const existUser =  await this.prisma.user.findUnique({
            where: {email: email}
        });

        if(existUser){
            throw new HttpException(
                'El correo ya se encuentra registrado',
                HttpStatus.CONFLICT
            )
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { email, password: hash},
        });

        return {
            success: true,
            message: 'Registro Exitoso',
            token: this.signToken(user.id, user.email, user.role),
            user:{
                id: user.id,
                email: user.email,
                role:user.role
            }
        }

    }


    async login(email: string, password: string){
        const user = await this.prisma.user.findUnique({
            where: {email}
        
        });

        if(!user){
            throw new HttpException(
                'Credenciales invalidas',
                HttpStatus.UNAUTHORIZED //error 401
            );

        } 

        const passwordValid = await bcrypt.compare(password, user.password);
        if(!passwordValid){
            throw new HttpException(
                'Credenciales inválidas',
                HttpStatus.UNAUTHORIZED
            );
        }

        const token = this.signToken(user.id, user.email, user.role);
        

        return {
            success: true,
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role //user o admin
            }
        }
    }


    private signToken(userId: number, email: string, role: string): string {

        //console.log('Secreto JWT', process.env.JWT_SECRET)

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está definido en las variables de entorno');
        }
        
        const payload = { sub: userId, email, role };
       // console.log('Payload decodificado:', payload);
        return this.jwtService.sign(payload); // ¡Sin pasar opciones! (usa las configuraciones globales)
        
       
    }





}

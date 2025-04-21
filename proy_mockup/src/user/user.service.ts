import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async createUser(email: string, password: string, role: string){
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role
            },
            select: {id: true, email: true, role: true}
        });
    }
  
    async findAll(){
       
        return this.prisma.user.findMany({
            
            select: {
                id: true,
                email: true,
                role: true,
                createAt: true
            }
        });
    }

    async findUserById(id: number){
        return this.prisma.user.findUnique({
            where: {id},
            select: { id: true, email: true, role: true}
        });

    }


    async updateUser(id: number, data: { email?: string; password?: string; role?: string}) {
        if (data.password){
            data.password = await bcrypt.hash(data.password, 10);
        }

        return this.prisma.user.update({
            where: {id},
            data,
            select: {id: true, email: true, role: true}
        });
    }


    async deleteUser(id: number){
        return this.prisma.user.delete({
            where: {id},
            select:{
                id: true,
                email: true
            }

        });
    }


    async changeUserRole(id: number, newRole: string, currentUserRole: string){
        if(currentUserRole !== 'admin'){
            throw new ForbiddenException('solo los administradores pueden cambiar roles');
        }

        return this.prisma.user.update({
            where: {id},
            data: { role: newRole},
            select: {
                id: true,
                email: true,
                role: true
            }
        });
    }
}

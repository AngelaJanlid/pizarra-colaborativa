import { Injectable, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { async } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MockupService{
 constructor( private prisma: PrismaService){}

 async createMockup(name: string, data: any, userId: number){

  console.log('Crear Mockup con:', { name, data, userId });
  return await this.prisma.mockup.create({
      data:{
          name,
          data:typeof data === 'string' ? data : JSON.stringify(data),
          userId
      },
      select: {id: true, name: true, data: true, userId: true}
  })
}


async findAllMockup(){
    return this.prisma.mockup.findMany({
        select: {
            id: true,
            name: true,
            data: true,
            createAt: true,
            userId: true,
            user: {
                select: {
                    id: true,
                    email: true
                }
            }
        }
    })
}

async getMockupsByUser(userId: number){
    const mockups = await this.prisma.mockup.findMany({
        where: { userId },
        orderBy: { createAt: 'desc' },
        select: {
          id: true,
          name: true,
          createAt: true, 
          data: true
        }
      });
  
      if (!mockups || mockups.length === 0) {
        throw new NotFoundException('No se encontraron mockups para este usuario');
      }
  
      return mockups;
    
}


async getMockupById(id: number) {

  console.log('Buscando mockup con id:', id); 


    const mockup = await this.prisma.mockup.findUnique({
      where: { id }
    });

    if (!mockup) {
      throw new NotFoundException(`Mockup con ID ${id} no encontrado`);
    }

    return mockup;
}



async updateMockup(updateData: { id: number; name?: string; data?: any; userId: string } ) {
  try {
    console.log('Datos recibidos para actualizar:', updateData);

    // Verifica si el mockup existe
    const existingMockup = await this.prisma.mockup.findUnique({
      where: { id: updateData.id },
    });

    if (!existingMockup) {
      throw new NotFoundException(`Mockup con ID ${updateData.id} no encontrado`);
    }

    // Verifica que el mockup pertenezca al usuario
    if (existingMockup.userId !== parseInt(updateData.userId, 10)) {
      throw new ForbiddenException('No tienes permiso para actualizar este mockup');
    }

    // Actualiza el mockup
    const updatedMockup = await this.prisma.mockup.update({
      where: { id: updateData.id },
      data: {
        name: updateData.name,
        data: updateData.data,
       
      },
    });

    console.log('Mockup actualizado:', updatedMockup);
    return updatedMockup;
  } catch (error) {
    console.error('Error en updateMockup:', error);
    throw error;
  }
}
async deleteMockup(id: number) {
    try {
      return await this.prisma.mockup.delete({
        where: { id }
      });
    } catch (error) {
      throw new NotFoundException(`Mockup con ID ${id} no encontrado`);
    }
  }



}


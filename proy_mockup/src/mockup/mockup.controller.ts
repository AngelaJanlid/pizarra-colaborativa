import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, Res, HttpStatus, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { MockupService } from './mockup.service';
import { Response} from '@nestjs/common';
import { brotliDecompress } from 'node:zlib';
import { Public } from '../../src/auth/decorators/public.decorator'; 
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Prisma } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('mockup')


export class MockupController{

    constructor( private mockupService: MockupService ) {}

    @Public()
    @Post('createMockup')
    async createMockup(@Body() body: any, @Res() res) {
      try {
        // Validación robusta
        if (!body.data || body.data === undefined) {
          return res.status(400).json({
            success: false,
            message: 'El campo "data" es requerido y no puede estar vacío'
          });
        }
    
        if (typeof body.data !== 'object' || Object.keys(body.data).length === 0) {
          return res.status(400).json({
            success: false,
            message: 'El campo "data" debe ser un objeto válido'
          });
        }
    
        // Resto de tu lógica...
        const result = await this.mockupService.createMockup(
          body.name,
          body.data,
          body.userId
        );
    
        return res.status(201).json({
          success: true,
          data: result
        });
    
      } catch (error) {
        console.error('Error en creación de mockup:', error);
        return res.status(500).json({
          success: false,
          message: 'Error interno al procesar el mockup'
        });
      }
    }

   // @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('AllMockups')
    async AllMockups(@Req() req: any){
      const mockups = await this.mockupService.findAllMockup();
      return { data: mockups }; 
    } 


    @Public()
    @Get(':userId/miMockups')
    async getMiMockups(@Param('userId') userId: string) {
      try {
        const numericUserId = parseInt(userId, 10);
        if (isNaN(numericUserId)) {
          throw new NotFoundException('ID de usuario inválido');
        }

        const mockups = await this.mockupService.getMockupsByUser(numericUserId);
        console.log('Mockups encontrados:', mockups); // Verifica los datos aquí
        return {
          success: true,
          count: mockups.length,
          data: mockups,
        };
      } catch (error) {
        console.error('Error al obtener los mockups del usuario:', error);
        throw new InternalServerErrorException('Error al obtener los mockups del usuario');
      }
    }




    @Public()
    @Get(':id')
    async getById(@Param('id') id: string, @Res() res) {
        try {
            const numericId = parseInt(id, 10);

            if (isNaN(numericId)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'ID inválido' });
            }

            const result = await this.mockupService.getMockupById(numericId);

            return res.status(200).json({ result });

        } catch (error) {
            return res.status(error.status || 500).json({
            message: error.message || 'Error al obtener el Mockup',
            });
        }
    }

    @Public()
    @Put('update')
    async updateMockup(
      @Body() body: { id: string; name?: string; data?: any; userId?: string },
      @Req() req,
      @Res() res,
    ) {
      try {
        const numericId = parseInt(body.id, 10);
        if (isNaN(numericId)) {
          return res.status(400).json({ message: 'ID inválido' });
        }

        const userId = body.userId || req.user.id; // Usa el userId del cuerpo o del token
        const result = await this.mockupService.updateMockup({
          id: numericId,
          name: body.name,
          data: body.data,
          userId,
        });

        return res.status(200).json(result);
      } catch (error) {
        if (error instanceof ForbiddenException) {
          return res.status(403).json({ message: error.message });
        }
        console.error('Error en updateMockup:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
    }

    
    
    @Public()
    @Delete(':id')
    async delete(@Param('id') id:string, @Res() res){
        try{
            await this.mockupService.deleteMockup(parseInt(id));
            return res.status(200).json({
                message: 'Mockup eliminado Correctamente'
            });



        }catch(error){
            return res.status(error.status || 500).json({
                message: error.message || 'Error al Eliminar el Mockup'
            })
        }   
    }



}



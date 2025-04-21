import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import {UserService} from '../user/user.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('user')

//@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {

    constructor(private readonly userService: UserService ){}

    @Roles('admin')
    @Post()
   
    async create(@Body() body: { email: string; password: string; role?: string}){
      
        return this.userService.createUser(body.email, body.password, body.role || 'user');
    }

    
    @Roles('admin')
    @Get()
    async findAll(@Req() req: any){
       //console.log('User from request:', req.user);
        return this.userService.findAll();
    }

    
    @Roles('admin')
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.userService.findUserById(parseInt(id));
    }


    @Roles('admin')
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() body: { email?: string; password?: string; role?: string },
      @Req() req: any
    ) {
      // Solo admins pueden cambiar roles
      if (body.role && req.user.role !== 'admin') {
        delete body.role;
      }
      return this.userService.updateUser(parseInt(id), body);
    }

    @Roles('admin')
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.userService.deleteUser(parseInt(id));
    }

    @Roles('admin')
    @Put(':id/role')
    async changeRole(
      @Param('id') id: string,
      @Body() body: { role: string },
      @Req() req: any
    ) {
      return this.userService.changeUserRole(parseInt(id), body.role, req.user.role);
    }
    
}

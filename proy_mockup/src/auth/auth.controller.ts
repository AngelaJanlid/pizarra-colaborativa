import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator'; 
import { SetMetadata } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  
  @Public()
  @Post('login')
    async login(@Body() body: { email: string; password: string }, @Res() res) {

    try{
        const result = await this.authService.login(body.email, body.password);


        return res.status(200).json({
          success: true,
          token: result.token,
          user: {
            id: result.user.id,  
            email: result.user.email,
            role: result.user.role,
          }

        });
    
    }catch(error){
      return res.status(error.status || 500).json({
      message: error.message || 'Error interno del servidor'});

    }  
  }


 
  @Public()
    @Post('register')
    async register(@Body() body: { email: string; password: string }, @Res() res) {
        try{
          const result = await this.authService.register(body.email, body.password);
          return res.status(HttpStatus.CREATED).json(result);
        
        } catch(error){
          return res.status(error.status || 500).json({
            message: error.message || 'Error interno del servidor'
        });
      }

  }
}

import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient { //primasclient es el que permite interactua con la base de datos.
    constructor(){
        super();
    }
}

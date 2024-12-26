import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('HealthCheck')
@Controller()
export class AppController {
  @Get()
  getHello(@Res() res: Response): void {
    const message = `ສະບາຍດີ Master Database ແລະ Replica Database`;
    res.send(message);
  }
}

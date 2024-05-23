import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {ConfigService} from "@nestjs/config";
import {successResponse} from "./utils/response";
import configuration from "./config/configuration";
import client from "./config/client";
import {Public} from "./decorators/public-endpoint.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private configService:ConfigService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Public()
  @Get('/config')
  getConfig(){
    return successResponse(client())
  }

}

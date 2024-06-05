import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import {AuthModule} from "../auth/auth.module";
import {AuthService} from "../auth/auth.service";

@Module({
  imports:[AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

import {
  Controller,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  ParseIntPipe,
  Put,
  Body,
  Query,
} from '@nestjs/common';

import { UserService } from '../services/user.service';
import { UserUpdate } from '../dto/user-update.dto';
import { JWTAuthGuard } from '../../../common/modules/auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../../common/modules/auth/guards/session-auth.guard';
import { User } from '../entities/user.entity';
import { PaginationInterceptor } from 'src/common/pagination/interceptors/pagination.interceptor';
import { PaginationQuery } from 'src/common/pagination/dtos/pagination-query.dto';

@Controller('profile')
@UseGuards(JWTAuthGuard, SessionAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  list(): Promise<User[]>  {
    return this.userService.list();
  }

  @Get(':id')
  get(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return this.userService.findOne({ where: { id } });
  }

  @Put(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatesUser: UserUpdate,
  ): Promise<User> {
    return this.userService.update(id, updatesUser);
  }
}

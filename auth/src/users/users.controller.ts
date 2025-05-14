import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/add-role/:role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addRole(@Param('id') id: string, @Param('role') role: string) {
    return this.usersService.addRole(id, role);
  }

  @Get(':id/remove-role/:role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeRole(@Param('id') id: string, @Param('role') role: string) {
    return this.usersService.removeRole(id, role);
  }
} 
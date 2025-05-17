import { Controller, Get, Param, Post, UseGuards, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post(":id/roles")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  setRole(@Param("id") id: string, @Body() roleData: { role: string }) {
    return this.usersService.setRole(id, roleData.role);
  }
}

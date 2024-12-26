import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserQueryDto } from './dto/query/user-query.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Version('1')
  @ApiOperation({
    summary: 'Create new user',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Get('all')
  @Version('1')
  @ApiOperation({
    summary: 'Find all users',
  })
  async findAll(@Query() query: UserQueryDto) {
    return await this.userService.getUsers(query);
  }

  @Get('byId/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Find user by id',
  })
  async getUserById(@Param('id') userId: string) {
    return await this.userService.getUserById(userId);
  }

  @Get('byName/:name')
  @Version('1')
  @ApiOperation({
    summary: 'Find user by name',
  })
  async getUserName(@Param('name') name: string) {
    return await this.userService.getUserName(name);
  }

  @Patch('update/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Update user by id',
  })
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @Delete('delete/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Delete user by id',
  })
  async deleteUser(@Param('id') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}

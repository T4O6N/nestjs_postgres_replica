import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    required: true,
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    required: false,
    description: 'User age',
    example: 20,
  })
  age?: number;

  @ApiProperty({
    required: false,
    description: 'Status of the user',
    example: true,
  })
  is_active?: boolean;
}

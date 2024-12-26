import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserQueryDto } from './dto/query/user-query.dto';
import { DateConverter } from 'src/utils/date-converter.util';
import { isEmpty } from 'class-validator';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}

  //NOTE - create user
  async createUser(createUserDto: CreateUserDto) {
    try {
      const findUserName = await this.prisma.user.findFirst({
        where: {
          name: createUserDto.name,
        },
      });

      if (findUserName) {
        throw new BadRequestException('This user name already exists');
      }

      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          is_active: true,
          created_at: DateConverter.toVientianeDateObject(),
          updated_at: DateConverter.toVientianeDateObject(),
        },
      });

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error while to creating user:', error.stack);
      throw new BadRequestException('Failed to create user');
    }
  }

  //NOTE - get all users
  async getUsers(query: UserQueryDto) {
    const { page = 1, limit = 10, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) {
        where.created_at.gte = DateConverter.toVientianeDateObject(
          `${startDate}T00:00:00`,
        );
      }
      if (endDate) {
        where.created_at.lte = DateConverter.toVientianeDateObject(
          `${endDate}T23:59:59`,
        );
      }
    }

    const [users, total] = await Promise.all([
      this.prisma.getReplica().user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const result = {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      users,
    };

    return result;
  }

  //NOTE - get user by id
  async getUserById(userId: string) {
    try {
      if (isEmpty(userId)) throw new BadRequestException('User id is required');

      const user = await this.prisma.getReplica().user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      if (!user) {
        throw new BadRequestException('This user is not found');
      }

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to get user');
    }
  }

  //NOTE - get user name
  async getUserName(name: string) {
    try {
      if (isEmpty(name)) throw new BadRequestException('User name is required');

      const findUsername = await this.prisma.getReplica().user.findFirst({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });

      if (!findUsername) {
        throw new BadRequestException('This user name is not found');
      }

      return findUsername;
    } catch (error) {
      this.logger.error('Error while find user name:', error.stack);
      throw new BadRequestException('Failed to get user');
    }
  }

  //NOTE - update user
  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    try {
      await this.getUserById(userId);

      const user = await this.prisma.user.update({
        where: {
          id: parseInt(userId),
        },
        data: {
          ...updateUserDto,
          updated_at: DateConverter.toVientianeDateObject(),
        },
      });

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error while updating user:', error.stack);
      throw new BadRequestException('Failed to update user');
    }
  }

  //NOTE - delete user
  async deleteUser(userId: string) {
    try {
      await this.getUserById(userId);

      const user = await this.prisma.user.delete({
        where: {
          id: parseInt(userId),
        },
      });

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error while deleting user:', error.stack);
      throw new BadRequestException('Failed to delete user');
    }
  }
}

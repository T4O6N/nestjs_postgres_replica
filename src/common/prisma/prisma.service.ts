import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly master: PrismaClient;
  private readonly replica: PrismaClient;
  private isConnected = false;

  constructor() {
    super({
      transactionOptions: {
        maxWait: 10000,
        timeout: 8000,
      },
    });
    this.master = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_MASTER_URL,
        },
      },
    });

    this.replica = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_REPLICA_URL,
        },
      },
    });
  }

  public getMaster() {
    return this.master;
  }

  public getReplica() {
    return this.replica;
  }

  async onModuleInit() {
    await this.master.$connect();
    await this.replica.$connect();
    this.isConnected = true;
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.isConnected = false;
  }

  async checkConnection(): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      // Query to check if the connection is still alive or not!!
      await this.master.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection check failed:', error);
      this.isConnected = false;
      return false;
    }
  }
}

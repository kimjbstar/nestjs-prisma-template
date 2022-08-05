import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SeedService {
  constructor(private readonly prismaService: PrismaService) {}

  log(content: string, verbose = true) {
    if (verbose === true) {
      console.log(`🌱: ${content}`);
    }
  }

  async setTestSuite() {
    await this.prismaService.truncateAll();
  }

  async setLocal() {
    await this.prismaService.truncateAll();
  }
}

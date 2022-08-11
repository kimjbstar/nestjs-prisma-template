import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { UtilService } from "../util/util.service";

@Injectable()
export class SeedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly utilService: UtilService
  ) {}

  async setTestSuite() {
    await this.prismaService.truncateAll();
  }

  async setLocalSuite() {
    await this.prismaService.truncateAll();

    const { salt, hashed } = await this.authService.encrypt("password");

    await this.prismaService.user.createMany({
      data: [
        {
          email: "super_admin@test.com",
          password: hashed,
          salt: salt,
          role: UserRole.SUPER_ADMIN,
          name: "슈퍼관리자",
          extra: { foo: "bar" },
        },
        ...this.utilService.range(1, 10000).map((i) => ({
          email: `user${i}@test.com`,
          password: hashed,
          salt: salt,
          role: UserRole.NORMAL,
          name: `유저${i}`,
        })),
      ],
    });

    const company = await this.prismaService.company.create({
      data: {
        name: `company01`,
      },
    });

    for (const idx of this.utilService.range(1, 100)) {
      const { id } = await this.prismaService.author.create({
        data: {
          companyId: company.id,
          name: `author${idx}`,
        },
      });
      await this.prismaService.post.createMany({
        data: [
          ...this.utilService.range(1, 2).map((i) => ({
            authorId: id,
            name: `author${idx}-post${i}`,
          })),
        ],
      });
    }
  }
}

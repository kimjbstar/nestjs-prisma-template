import { Injectable } from "@nestjs/common";
import { Cocktail, UserRole } from "@prisma/client";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { UtilService } from "../util/util.service";
import { faker } from "@faker-js/faker";

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

    const TECHNIQUES = ["Frost", "Shake", "Build", "Float", "Stir", "Blend"];
    await this.prismaService.technique.createMany({
      data: [...TECHNIQUES.map((name) => ({ name }))],
    });

    await this.createIngredient(10);
    await this.createGlass(5);
    await this.createGarnish(4);
  }

  async createGlass(count = 1) {
    for (let i = 0; i < count; i++) {
      await this.prismaService.glass.create({
        data: {
          name: faker.animal.insect(),
        },
      });
    }
  }

  async createTechnique(count = 1) {
    for (let i = 0; i < count; i++) {
      await this.prismaService.technique.create({
        data: {
          name: faker.animal.insect(),
        },
      });
    }
  }

  async createGarnish(count = 1) {
    for (let i = 0; i < count; i++) {
      await this.prismaService.garnish.create({
        data: {
          name: faker.animal.insect(),
        },
      });
    }
  }

  async createRecipe(cockTail: Cocktail, count = 1) {
    for (let i = 0; i < count; i++) {
      await this.prismaService.recipe.create({
        data: {
          cocktailId: cockTail.id,
          content: faker.lorem.words(),
        },
      });
    }
  }

  async createIngredient(count = 1) {
    for (let i = 0; i < count; i++) {
      await this.prismaService.ingredient.create({
        data: {
          name: faker.animal.bear(),
        },
      });
    }
  }
}

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
    private readonly utilService: UtilService,
  ) {}

  async setTestSuite() {
    await this.prismaService.truncateAll();
  }

  async setLocalSuite() {
    await this.prismaService.truncateAll();

    const { salt, hashed } = await this.authService.encrypt("password");

    const ROLES = [UserRole.NORMAL, UserRole.COMPANY];

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
          email: faker.internet.email(),
          password: hashed,
          salt: salt,
          role: ROLES[Math.floor(Math.random() * ROLES.length)],
          name: faker.name.fullName(),
        })),
      ],
    });

    const TECHNIQUES = ["Frost", "Shake", "Build", "Float", "Stir", "Blend"];
    await this.prismaService.technique.createMany({
      data: [...TECHNIQUES.map((name) => ({ name }))],
    });

    await this.prismaService.glass.createMany({
      data: [
        { name: "샷 글라스", nameEnglish: "Shot Glass", volume: "1.5 ~ 2" },
        { name: "코디얼 글라스", nameEnglish: "Cordial Glass", volume: "1" },
        {
          name: "푸스 카페 글라스",
          nameEnglish: "Pousse Cafe",
          volume: "Glass,	1.5",
        },
        {
          name: "올드 패션드 글라스",
          nameEnglish: "Old Fashioned",
          volume: "Glass,	6 ~ 8",
        },
        {
          name: "칵테일 글라스",
          nameEnglish: "Cocktail Glass",
          volume: "6 ~ 8",
        },
        {
          name: "마르가리타 글라스",
          nameEnglish: "Margarita Glass",
          volume: "6 ~ 8",
        },
        { name: "사워 글라스", nameEnglish: "Sour Glass", volume: "3 ~ 6" },
        {
          name: "레드 와인 글라스",
          nameEnglish: "Red Wine",
          volume: "Glass,	8 ~ 12",
        },
        {
          name: "화이트 와인 글라스",
          nameEnglish: "White Wind",
          volume: "Glass,	8 ~ 12",
        },
        { name: "셰리 글라스", nameEnglish: "Sherry Glass", volume: "2 ~ 4" },
        {
          name: "소서 샴페인 글라스",
          nameEnglish: "Saucer Champagne",
          volume: "Glass,	4 ~ 10",
        },
        {
          name: "플루트 샴페인 글라스",
          nameEnglish: "Plute Champagne",
          volume: "Glass,	3 ~ 6",
        },
        { name: "브랜디 글라스", nameEnglish: "Brandy Glass", volume: "6 ~ 8" },
        {
          name: "아이리시 커피 글라스",
          nameEnglish: "Irish Coffee",
          volume: "Glass,	8 ~ 10",
        },
        { name: "머그 글라스", nameEnglish: "Mug Glass", volume: "8 ~ 10" },
        { name: "필스너 글라스", nameEnglish: "Pilsner Glass", volume: "10" },
        {
          name: "하이볼 글라스",
          nameEnglish: "Highball Glass",
          volume: "8 ~ 10",
        },
        { name: "콜린스 글라스", nameEnglish: "Collins Glass", volume: "12" },
        {
          name: "허리케인 글라스",
          nameEnglish: "Hurricane Glass",
          volume: "13 ~ 15",
        },
      ],
    });

    const INGREDIENT = [
      "스카치 위스키",
      "아마레토",
      "진",
      "토닉워터",
      "라임",
      "테킬라",
      "오렌지 주스",
      "그레나딘 시럽",
      "블루큐라소",
      "보드카",
      "레몬 에이드",
      "레몬 슬라이스",
      "버번 위스키",
      "레몬 주스",
      "설탕시럽",
      "탄산수",
      "체리",
      "브랜디",
      "오렌지 큐라소",
      "베네딕틴",
      "트리플섹",
      "드라이 진",
    ];
    await this.prismaService.ingredient.createMany({
      data: [...INGREDIENT.map((name) => ({ name }))],
    });

    await this.prismaService.cocktail.create({
      data: {
        name: "진토닉",
        nameEnglish: "gin tonic",
        glassId: 1,
        techniques: {
          connect: [1, 2].map((id) => ({ id })),
        },
        ingredients: {
          connect: [2, 3].map((id) => ({ id })),
        },
      },
    });

    await this.prismaService.cocktail.create({
      data: {
        name: "블랙 러시안",
        nameEnglish: "black russian",
        glassId: 1,
        techniques: {
          connect: [1, 2].map((id) => ({ id })),
        },
        ingredients: {
          connect: [2, 3].map((id) => ({ id })),
        },
      },
    });
  }

  async createGlass(count = 1) {
    for (let i = 0; i < count; i++) {
      await this.prismaService.glass.create({
        data: {
          name: faker.animal.insect(),
          nameEnglish: faker.animal.insect(),
          volume: "1~2",
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

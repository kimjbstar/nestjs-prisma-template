import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./modules/prisma/prisma.service";
import { GlobalModules, mockThirdParty } from "./test.module";

describe("AppController", () => {
  let appController: AppController;
  let prismaService: PrismaService;
  let testingModule: TestingModule;

  beforeAll(async () => {
    const testingModuleBuilder = await Test.createTestingModule({
      imports: [...GlobalModules],
      controllers: [AppController],
      providers: [AppService],
      exports: [],
    });
    testingModule = await mockThirdParty(testingModuleBuilder)
      .compile()
      .catch((e) => {
        console.log(e);
        console.log("APP MODULE FAIL");
        process.exit(1);
      });

    appController = testingModule.get<AppController>(AppController);
    prismaService = testingModule.get<PrismaService>(PrismaService);
  });

  describe("getHello", () => {
    it('"Hello World!!"를 리턴 해야한다.', () => {
      const { hello } = appController.getHello();
      expect(hello).toBe("Hello World!!");
    });
  });

  describe("getCurrentEnv", () => {
    it('현재 환경 값은 "test"이다.', () => {
      const { env } = appController.getCurrentEnv();
      expect(env).toBe("test");
    });
  });

  afterAll(async () => {
    await prismaService?.$disconnect();
  });
});

import { NestFactory } from "@nestjs/core";
import { SeedModule } from "./modules/seed/seed.module";
import { SeedService } from "./modules/seed/seed.service";
(async function () {
  const app = await NestFactory.createApplicationContext(SeedModule);
  await app.get(SeedService).setLocalSuite();

  app.close();
  process.exit(0);
})();

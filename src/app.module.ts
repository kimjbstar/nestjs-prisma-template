import { MiddlewareConsumer, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ExceptionController } from "./controllers/exception.controller";
import { HealthController } from "./controllers/health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { BaseLoggerModule } from "./modules/base-logger/base-logger.module";
import { CachesModule } from "./modules/caches/caches.module";
import { FilesModule } from "./modules/files/files.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { UtilModule } from "./modules/util/util.module";
import configOptions from "@src/common/app.config";
import { UsersModule } from "./modules/users/users.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CocktailsModule } from "./modules/cocktails/cocktails.module";
import { GarnishesModule } from "./modules/garnishes/garnishes.module";
import { GlassesModule } from "./modules/glasses/glasses.module";
import { IngredientsModule } from "./modules/ingredients/ingredients.module";
import { RecipesModule } from "./modules/recipes/recipes.module";
import { TechniquesModule } from "./modules/techniques/techniques.module";

/**
 * 시작점 모듈 입니다. 모든 모듈은 이 모듈로 Inject됩니다.
 */
@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      autoSchemaFile: true,
    }),
    AuthModule,
    FilesModule,
    CachesModule,
    BaseLoggerModule,
    UtilModule,
    PrismaModule,
    UsersModule,
    CocktailsModule,
    GarnishesModule,
    GlassesModule,
    IngredientsModule,
    RecipesModule,
    TechniquesModule,
  ],
  controllers: [AppController, HealthController, ExceptionController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements OnModuleInit {
  configure(consumer: MiddlewareConsumer): void {
    // consumer.apply(ContextMiddleware).forRoutes("*");
  }
  onModuleInit() {}
}

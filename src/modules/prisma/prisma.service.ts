import { Prisma, PrismaClient, PrismaPromise } from "@prisma/client";
import * as path from "path";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaNotFoundError } from "@src/common/exceptions/filters/prisma-not-found.exception-filters";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  publicPath: string;
  constructor() {
    super({
      rejectOnNotFound: {
        findUnique: (e) => {
          throw new PrismaNotFoundError(e);
        },
      },
    });
    this.publicPath = path.join(__dirname, "../../public");
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async truncateAll() {
    if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "local") {
      return;
    }

    const databaseName =
      process.env.NODE_ENV === "test" ? "testing" : "logipasta";
    const transactions: PrismaPromise<any>[] = [];
    transactions.push(this.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

    const result = await this.$queryRawUnsafe<
      {
        tableName: string;
      }[]
    >(
      `SELECT TABLE_NAME as tableName from information_schema.TABLES WHERE TABLE_SCHEMA = '${databaseName}';`,
    );

    for (const { tableName } of result) {
      if (tableName !== "_prisma_migrations") {
        try {
          transactions.push(
            this.$executeRawUnsafe(`TRUNCATE \`${tableName}\`;`),
          );
        } catch (error) {
          console.log({ error });
        }
      }
    }

    transactions.push(this.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`);

    try {
      await this.$transaction(transactions);
    } catch (error) {
      console.log({ error });
    }
  }

  /**
   * 테이블명에 해당하는 테이블의 모든 데이터를 삭제하고 초기화합니다.
   * @param modelName
   * @param rejectOnFail
   */
  async truncateTable(modelName: string, rejectOnFail = false) {
    try {
      await this.$queryRawUnsafe(`DELETE From \`${modelName}\` where id > 0`);
      await this.$queryRawUnsafe(
        `ALTER TABLE \`${modelName}\` AUTO_INCREMENT=1`,
      );
    } catch (e) {
      if (rejectOnFail) {
        throw e;
      } else {
        console.error(e);
      }
    }
  }

  /**
   *
   * @param reject
   */
  throwOrNot(reject: boolean): Prisma.RejectOnNotFound {
    if (reject === false) {
      return false;
    }
    return (e: Error) => {
      throw new PrismaNotFoundError(e);
    };
  }

  async findUniqueUser(id: string) {
    const user = await this.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findFirstUser(args: Prisma.UserWhereInput, reject = false) {
    const user = await this.user.findFirst({
      where: args,
      rejectOnNotFound: this.throwOrNot(reject),
    });
    return user;
  }
}

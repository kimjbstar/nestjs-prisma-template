import { Prisma, PrismaClient, PrismaPromise } from "@prisma/client";
import * as path from "path";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaNotFoundError } from "@src/common/exceptions/filters/prisma-not-found.exception-filters";
import { camelCase } from "change-case";
import { FindManyArgs } from "@src/common/base.repository";
import { BaseListArgs } from "@src/common/dto/base-list-args";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  publicPath: string;
  // FIXME: 스키마명
  static schemaName = "template";

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
      process.env.NODE_ENV === "test" ? "testing" : "template";
    const transactions: PrismaPromise<any>[] = [];
    transactions.push(this.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

    const result = await this.$queryRawUnsafe<
      {
        tableName: string;
      }[]
    >(
      `SELECT TABLE_NAME as tableName from information_schema.TABLES WHERE TABLE_SCHEMA = '${databaseName}';`
    );

    for (const { tableName } of result) {
      if (tableName !== "_prisma_migrations") {
        try {
          transactions.push(
            this.$executeRawUnsafe(`TRUNCATE \`${tableName}\`;`)
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
        `ALTER TABLE \`${modelName}\` AUTO_INCREMENT=1`
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

  setOrderAndLimit<T extends FindManyArgs, U extends BaseListArgs>(
    prismaFindManyArg: T,
    listArg: U
  ): T {
    prismaFindManyArg.take = listArg.take;
    const skip = (listArg.page - 1) * listArg.take;
    prismaFindManyArg.skip = !Number.isNaN(skip) ? skip : 0;
    prismaFindManyArg.orderBy = prismaFindManyArg.orderBy ?? {};

    if (!listArg.order_by) {
      return prismaFindManyArg;
    }
    const { isSuccess, cursorField, direction, cursorFindDirection } =
      this.parseOrderBy(listArg.order_by);
    if (!isSuccess) {
      return prismaFindManyArg;
    }

    prismaFindManyArg.orderBy[cursorField] = direction;
    if (listArg.after) {
      prismaFindManyArg.where[cursorField] = {
        [cursorFindDirection]: listArg.after,
      };
    }

    return prismaFindManyArg;
  }

  parseOrderBy(arg: string): {
    isSuccess: boolean;
    cursorField: string;
    direction: Prisma.SortOrder;
    cursorFindDirection: "lte" | "gte";
  } {
    const [rawCursorField, rawDirection] = arg.split("__");

    if (!rawCursorField || !rawDirection) {
      return {
        isSuccess: false,
        cursorField: null,
        direction: null,
        cursorFindDirection: null,
      };
    }
    const direction = rawDirection.toLowerCase();
    if (direction !== "asc" && direction !== "desc") {
      return {
        isSuccess: false,
        cursorField: null,
        direction: null,
        cursorFindDirection: null,
      };
    }
    const cursorFindDirection = rawDirection === "DESC" ? "lte" : "gte";
    const cursorField = camelCase(rawCursorField.toLowerCase());

    return {
      isSuccess: true,
      cursorField: cursorField,
      direction: direction,
      cursorFindDirection: cursorFindDirection,
    };
  }
}

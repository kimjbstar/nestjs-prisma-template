import { Injectable } from "@nestjs/common";
import { BaseLoggerService } from "../base-logger/base-logger.service";
import { ConfigService } from "@nestjs/config";
import moment from "moment";
const punycode = require("punycode/");

@Injectable()
export class UtilService {
  constructor(private readonly configService: ConfigService) {}
  static ENCRYPT_KEYLEN = 32 as const;

  /**
   * array chunk
   */
  chunk<T>(array: T[], size: number): T[][] {
    const chunked: T[][] = [];

    for (let element of array) {
      const last = chunked[chunked.length - 1];

      if (!last || last.length === size) {
        chunked.push([element]);
      } else {
        last.push(element);
      }
    }
    return chunked;
  }

  /**
   * production 체크
   */
  isProduction(): boolean {
    return this.configService.get("NODE_ENV") === "production";
  }

  /**
   * development 체크
   */
  isDevelopment(): boolean {
    return this.configService.get("NODE_ENV") === "development";
  }

  /**
   * local 체크
   */
  isLocal(): boolean {
    return this.configService.get("NODE_ENV") === "local";
  }

  /**
   * test 체크
   */
  isTest(): boolean {
    return this.configService.get("NODE_ENV") === "test";
  }

  /**
   * object -> querystring
   */
  objectToQueryString(
    src: Record<string, any>,
    _option?: {
      keyUpperCase: boolean;
    },
  ): string {
    const option = { ..._option };
    const { keyUpperCase = false } = option;
    let qsParams = new URLSearchParams();
    for (let [key, value] of Object.entries(src)) {
      key = keyUpperCase ? key.toUpperCase() : key;
      if (value) {
        qsParams.append(key, value.toString());
      }
    }
    return qsParams.toString();
  }

  /**
   * get pretty stack
   */
  getPrettyStack(error: Error): string[] {
    if (this.isProduction() === true) {
      return null;
    }
    return error.stack?.split(/(?:\r\n|\r|\n)/g);
  }

  /**
   * 주어진 문자열에 마스킹 처리를 한다.
   * @param {string} str 대상 문자열
   * @param {number} ratio 마스킹 처리할 비율
   * @returns
   */
  maskByRatio(str: string, ratio = 2 / 3): string {
    if (str === null) {
      return null;
    }
    return str.slice(0, Math.floor(str.length * ratio)).padEnd(str.length, "*");
  }

  /**
   * start 값으로부터 출발해서 end로 끝나는 incremental array를 리턴합니다.
   * @param start
   * @param end
   * @returns
   */
  range(start: number, end: number): number[] {
    if (start > end) {
      return this.range(end, start).reverse();
    }
    return Array(end - start + 1)
      .fill(null)
      .map((_, idx) => start + idx);
  }

  /**
   * 바이트 길이 체크
   * @param str
   * @returns
   */
  byteLength(str: string): number {
    if (!str) {
      return 0;
    }
    return Buffer.byteLength(str, "utf-8");
  }

  toPastDay(src: number): string {
    return moment().subtract(src, "days").format("YYYYMMDD");
  }

  skipTakes(count: number, take = 2000): { skip: number; take: number }[] {
    const result: { skip: number; take: number }[] = [];
    for (let i = 0; i * take < count; i++) {
      result.push({
        skip: i * take,
        take: take,
      });
    }
    return result;
  }

  /** word 리스트를 돌며 g 정규식으로 제거한다. */
  replaceToBlank(src: string, words: string[]) {
    if (src === null) return null;
    for (const word of words) {
      src = src.replace(new RegExp(`(\\()*${word}(\\))*`, "g"), "");
    }
    return src.trim();
  }
}

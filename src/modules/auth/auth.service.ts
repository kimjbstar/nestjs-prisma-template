import { Injectable } from "@nestjs/common";
import { SessionData } from "@src/common/types/session";
import * as crypto from "crypto";
import { Request } from "express";

export type ApplicationRequest = Request & {
  session: ApplicationSessionData;
};

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export type ApplicationSessionData = SessionData<{
  user?: SessionUser;
}>;

@Injectable()
export class AuthService {
  constructor() {}
  static ENCRYPT_KEYLEN = 32 as const;
  static ENCRYPT_ITERATION = 100 as const;
  static ENCRYPT_ALGORITHM = "sha512" as const;

  /** 패스워드 -> hash, salt 리턴 */
  async encrypt(password: string): Promise<{ salt: string; hashed: string }> {
    const salt = (
      await crypto.randomBytes(AuthService.ENCRYPT_KEYLEN)
    ).toString("hex");
    const hashed = await this.pbkdf2(salt, password);
    return {
      salt,
      hashed,
    };
  }

  async pbkdf2(salt: string, password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        crypto.pbkdf2(
          password,
          salt,
          AuthService.ENCRYPT_ITERATION,
          AuthService.ENCRYPT_KEYLEN,
          AuthService.ENCRYPT_ALGORITHM,
          (err, derivedKey) => {
            if (err) throw err;
            const hashed = derivedKey.toString("hex");
            resolve(hashed);
          }
        );
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  // async setUser(
  //   session: ApplicationSessionData,
  //   user: SessionUser
  // ): Promise<ApplicationSessionData> {
  //   session.user = user;
  //   session.save();
  //   return session;
  // }

  // async clear(session: ApplicationSessionData) {
  //   session.destroy(() => {});
  // }
}

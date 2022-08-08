import { User as _User } from "./user";
import { Author as _Author } from "./author";
import { Post as _Post } from "./post";

export namespace PrismaModel {
  export class User extends _User {}
  export class Author extends _Author {}
  export class Post extends _Post {}

  export const extraModels = [User, Author, Post];
}

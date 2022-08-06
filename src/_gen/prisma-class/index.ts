import { User as _User } from './user'
import { Author as _Author } from './author'
import { Book as _Book } from './book'

export namespace PrismaModel {
	export class User extends _User {}
	export class Author extends _Author {}
	export class Book extends _Book {}

	export const extraModels = [User, Author, Book]
}

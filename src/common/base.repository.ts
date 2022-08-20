export interface FindManyArgs {
  select?: any;
  include?: any;
  where?: any;
  orderBy?: any;
  cursor?: any;
  take?: number;
  skip?: number;
}

export interface FindManyResult<T> {
  totalCount?: number;
  totalSum?: number;
  items: T[];
}

export class BaseRepository {}

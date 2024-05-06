export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export type Project = {
  id?: number;
  name: string;
  timeupdated: string;
  timecreated: string;
  thumbnail?: string;
};

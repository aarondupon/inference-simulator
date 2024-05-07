export type Project = {
  id?: number;
  name: string;
  timeupdated: Date | string;
  timecreated: Date | string;
  thumbnail?: string;
  frames?: Frame[];
};

export interface Frame {
  id: number;
  name: string;
  tags: string[];
  image: string;
  thumbnail: string;
  timecreated: Date | string;
}


export interface IData {
  title: string;
  desc: string;
  done: boolean;
  owner: string;
  marker: string | null;
  contributors: string[] ;
}

export interface IDatabase {
  data: Array<IData>;
  users: Array<string>;
}
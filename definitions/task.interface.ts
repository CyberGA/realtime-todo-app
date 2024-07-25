
export interface ITask {
  id: string;
  title: string;
  desc: string;
  done: boolean;
  owner: string;
  marker: string | null;
  contributors: string[];
}

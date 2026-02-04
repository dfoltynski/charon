export type Environment = "staging" | "preview";

export interface HistoryData {
  environment: Environment;
  name: string;
  branchname: string;
  projectname: string;
  time: string;
}

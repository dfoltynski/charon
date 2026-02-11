export type Environment = "staging" | "preview";

export interface HistoryData {
  environment: Environment;
  name: string;
  commitsha: string;
  projectname: string;
  time: string;
}

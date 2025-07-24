import { Task } from "./task.model";

export interface Story {
  id: number;
  title: string;
  description: string;
  status: string;  
  type:string;
  created_at:Date;
  sprintId: number;
  tasks?:Task[];
}

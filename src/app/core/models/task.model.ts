import { Employee } from "./employee.model";
import { Story } from "./story.model";

export interface Task {
  id: number;
  title: string;
  description?: string;
  type?: string;
  story_id?: number;
  assign_to?: number;
  status?: string;
  points?: number;
  estimated_hours?: number;
  created_at?: string; 
  story?: Story;
  assignee?: Employee;
}
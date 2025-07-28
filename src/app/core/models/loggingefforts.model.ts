export interface LoggingEffort {
  id: number;
  date: string;
  hours_spent: string;
  description: string;
  logged_by: number;
  logged_by_name?: string; 
  task_id: number;
}

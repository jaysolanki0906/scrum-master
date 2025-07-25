import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private supabaseService: SupabaseService) {}
  getTask(id: string) {
    return from(
      this.supabaseService.client.from('task').select('*').eq('story_id', id)
    );
  }
  addTask(payload: Task) {
    return from(
      this.supabaseService.client
        .from('task')
        .insert(payload)
        .then(({ data, error }) => {
          if (error) throw error;
          console.log('story by ID:', data);
          return data;
        })
    );
  }
  editTask(id:string,payload:Task)
  {
    return from(
      this.supabaseService.client.from('task').update(payload).eq("id",id).then(({ data, error }) => {
          if (error) throw error;
          console.log('task by ID:', data);
          return data;
        })
    );
  }
  getTaskById(id:string)
  {
    return from(
      this.supabaseService.client.from('task').select('*').eq('id',id).then(({ data, error }) => {
          if (error) throw error;
          console.log('task by ID:', data);
          return data;
        })
    );
  }
  deleteTask(id:string)
  {
    return from(
      this.supabaseService.client.from('task').delete().eq("id",id).then(({ data, error }) => {
          if (error) throw error;
          console.log('task by ID:', data);
          return data;
        })
    );
  }
}

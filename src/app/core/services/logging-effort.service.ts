import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import { LoggingEffort } from '../models/loggingefforts.model';

@Injectable({
  providedIn: 'root'
})
export class LoggingEffortService {

  constructor(private supabase:SupabaseService) { }
  getAllEfforts(id:string) {
    return from(
      this.supabase.client
        .from('loggingefforts')
        .select('*')
        .eq('task_id',id)
        .then(({ data, error }) => {
          if (error) throw error;
          return data as LoggingEffort[];
        })
    );
  }
  addLogginEfforts(paylaod:LoggingEffort)
  {
    return from(
      this.supabase.client.from('loggingefforts').insert(paylaod).then(({ data, error }) => {
          if (error) throw error;
          return data 
        })
    );
  }
  getAllEmployeesByName() {
  return from(this.supabase.client
    .from('employee')
    .select('id, name') 
    .then(({ data, error }) => {
      if (error) throw error;
      return data;
    }));

}
editLogginEfforts(id:string,paylaod:LoggingEffort)
{
  return from(
    this.supabase.client.from('loggingefforts').update(paylaod).eq('id',id).then(({ data, error }) => {
        if (error) throw error;
        return data
      })
  );
}
deleteLogginEfforts(id:string)
{
  return from(
    this.supabase.client.from('loggingefforts').delete().eq('id',id).then(({ data, error }) => {
        if (error) throw error;
        return data
      })
  );
}
getAllTasks(){
   return from(
    this.supabase.client
      .from('task')
      .select('id, title') 
      .then(({ data, error }) => {
        if (error) throw error;
        return data as { id: number; title: string }[];
      })
  );
}

}

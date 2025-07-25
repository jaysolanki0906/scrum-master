import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Sprint } from '../models/sprint.model';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  constructor(private supabaseService: SupabaseService) {}

  // ✅ Get sprints by projectId
  getSprint(projectId: string) {
    return from(
      this.supabaseService.client
        .from('sprint')
        .select('*')
        .eq('projectId', projectId)
        .then(({ data, error }) => {
          if (error) throw error;
          console.log('Project by ID:', data);
          return data;
        })
    );
  }

  // ✅ Get sprint by ID
getSprintById(sprintId: string | number) {
  return from(
    this.supabaseService.client
      .from('sprint')
      .select('*')
      .eq('id', sprintId)
      .single() // ensures only one object is returned
      .then(({ data, error }) => {
        if (error) throw error;
        console.log('Sprint by ID:', data);
        return data;
      })
  );
}


  // ✅ Update sprint by ID
  updateSprint(sprintId: number, updatedData: Sprint) {
    return from(
      this.supabaseService.client
        .from('sprint')
        .update(updatedData)
        .eq('id', sprintId)
        .select()
        .then(({ data, error }) => {
          if (error) throw error;
          console.log('Sprint Updated:', data);
          return data;
        })
    );
  }

  // ✅ Add new sprint
  addSprint(sprintData: Sprint) {
    return from(
      this.supabaseService.client
        .from('sprint')
        .insert([sprintData])
        .select()
        .then(({ data, error }) => {
          if (error) throw error;
          console.log('Sprint Added:', data);
          return data;
        })
    );
  }

  // ✅ Delete sprint by ID
  deleteSprint(sprintId: number) {
    return from(
      this.supabaseService.client
        .from('sprint')
        .delete()
        .eq('id', sprintId)
        .then(({ data, error }) => {
          if (error) throw error;
          console.log('Sprint Deleted:', data);
          return data;
        })
    );
  }
}

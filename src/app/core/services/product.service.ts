import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private supabaseService: SupabaseService) {}

  // ✅ Get all projects
  getProjectsData(): Observable<Project[]> {
    return from(
      this.supabaseService.client
        .from('projects')
        .select('*')
        .order('id', { ascending: true })
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Project[];
        })
    );
  }

  // ✅ Add a new project
  addProject(project: Project): Observable<Project> {
    return from(
      this.supabaseService.client
        .from('projects')
        .insert([project])
        .select()
        .then(({ data, error }) => {
          if (error) throw error;
          return data![0];
        })
    );
  }

  // ✅ Edit a project
  editProject(id: number, payload: Partial<Project>): Observable<Project> {
    return from(
      this.supabaseService.client
        .from('projects')
        .update(payload)
        .eq('id', id)
        .select()
        .then(({ data, error }) => {
          if (error) throw error;
          return data![0];
        })
    );
  }

  // ✅ Delete a project
  deleteProject(id: number): Observable<boolean> {
    return from(
      this.supabaseService.client
        .from('projects')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
          return true;
        })
    );
  }
  getProjectById(id:string)
  {
    return from(
      this.supabaseService.client.from('projects').select('*').eq('id',id).then(({ data,error }) => {
          if (error) throw error;
          return data;
        })
    );
  }
}

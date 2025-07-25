// src/app/core/services/employee.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { catchError, from, map, throwError } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private supabaseService: SupabaseService) {}

  getEmployees() {
    return from(
      this.supabaseService.client
        .from('employee')
        .select('*')
        .order('id', { ascending: true })
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  }
   createSupabaseUser(email: string, password: string) {
  return from(
    this.supabaseService.client.auth.signUp({
      email,
      password,
    })
  ).pipe(
    map((result) => {
      if (result.error) throw result.error;
      const user = result.data?.user;
      if (!user) throw new Error('User creation failed');
      return user.id; 
    }),
    catchError((err) => throwError(() => err))
  );
}


  updateEmployee(id: string, payload: Employee) {
    return from(
      this.supabaseService.client
        .from('employee')
        .update(payload)
        .eq('id', id)
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  }

  addEmployee(payload: Employee) {
    return from(
      this.supabaseService.client
        .from('employee')
        .insert(payload)
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  }

  deleteEmployee(id: string) {
    return from(
      this.supabaseService.client
        .from('employee')
        .delete()
        .eq('id', id)
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  }
  checkEmployeeCredentials(email: string, password: string) {
  return from(
    this.supabaseService.client
      .from('employee')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .then(({ data, error }) => {
        if (error) throw error;
        return data; 
      })
  );
}
getPerticularEmployee(id:string)
{
  return from(this.supabaseService.client.from('employee').select('*').eq('id',id).then(({ data, error }) => {
        if (error) throw error;
        return data; 
      })
  );
}

}

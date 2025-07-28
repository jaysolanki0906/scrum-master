import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedProjectId = new BehaviorSubject<string | null>(null);
  selectedProjectId$ = this.selectedProjectId.asObservable();

  private userId = new BehaviorSubject<string | null>(null);
  userId$ = this.userId.asObservable();

  private userRole = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRole.asObservable();

  setSelectedProjectId(id: string) {
    this.selectedProjectId.next(id);
  }

  getSelectedProjectId(): string | null {
    return this.selectedProjectId.value;
  }

  setUserId(id: string) {
    this.userId.next(id);
  }

  getUserId(): string | null {
    return this.userId.value;
  }

  setUserRole(role: string) {
    this.userRole.next(role);
    console.log('SharedService: Role set to', role);
  }

  getUserRole(): string | null {
    console.log('SharedService: Current role is', this.userRole.value);
    return this.userRole.value;
  }

  isAdmin(): boolean {
    return this.userRole.value === 'admin';
  }

  isUser(): boolean {
    return this.userRole.value === 'user';
  }
  getAccessibleModules(): string[] {
    const role = this.userRole.value?.toLowerCase();

    let values: string[] = [];

    console.log("This is role in shared service", role);

    if (role === 'admin') {
      values = [
        'dashboard',
        'projects',
        'sprint',
        'scrum-board',
        'employee',
        'profile',
        'change-password',
        'logging',
        'logout'
      ];
    } else if (role === 'user') {
      values = [
        'dashboard',
        'scrum-board',
        'profile',
        'change-password',
        'logout',
        'logging',
      ];
    }

    console.log("Accessible modules:", values);
    return values;
  }

  clearSession() {
    this.userId.next(null);
    this.userRole.next(null);
    this.selectedProjectId.next(null);
  }
  // shared.service.ts (new method)
  // async initializeUserFromSupabase(supabase: SupabaseClient): Promise<boolean> {
  //   const { data: { session }, error } = await supabase.auth.getSession();

  //   if (!session || error) {
  //     return false;
  //   }

  //   const user = session.user;
  //   const employeeId =  user.id;

  //   const { data: employee, error: empErr } = await supabase
  //     .from('employee')
  //     .select('*')
  //     .eq('refrences', employeeId)
  //     .single();

  //   if (empErr || !employee) {
  //     return false;
  //   }

  //   this.setUserId(employee.id);
  //   this.setUserRole(employee.role);
  //   return true;
  // }


}

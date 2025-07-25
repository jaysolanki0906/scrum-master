import { CanActivateFn, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { EmployeeService } from '../services/employee.service';
import { SharedService } from '../services/shared.service';

export const homeGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const supabaseService = inject(SupabaseService);
  const employeeService = inject(EmployeeService);
  const sharedService = inject(SharedService);

  try {
    const {
      data: { user },
    } = await supabaseService.client.auth.getUser();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    const userId = user.id;

    const { data: empData, error: empError } = await supabaseService.client
      .from('employee')
      .select('*')
      .eq('refrences', userId)
      .single();

    if (empError || !empData) {
      console.warn('No employee found for user');
      router.navigate(['/access-denied']);
      return false;
    }

    sharedService.setUserId(empData.id);
    sharedService.setUserRole(empData.role);

    return true;
  } catch (err) {
    console.error('Error in homeGuard:', err);
    router.navigate(['/login']);
    return false;
  }
};

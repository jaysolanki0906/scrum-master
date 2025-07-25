// role-based.guard.ts
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { SupabaseService } from '../services/supabase.service';

export const roleBasedGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const sharedService = inject(SharedService);
  const supabase = inject(SupabaseService).client;
  const router = inject(Router);

  // 🟢 Recover session if role is missing
  if (!sharedService.getUserRole()) {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (!session || error) {
      console.warn('Session invalid or missing');
      router.navigate(['/access-denied']);
      return false;
    }

    const user = session.user;
    const { data: employee, error: empErr } = await supabase
      .from('employee')
      .select('*')
      .eq('refrences', user.id)
      .single();

    if (empErr || !employee) {
      console.warn('Employee not found for user', user.id);
      router.navigate(['/access-denied']);
      return false;
    }

    sharedService.setUserId(employee.id);
    sharedService.setUserRole(employee.role);
  }

  const url = state.url.toLowerCase().replace(/^\//, '').split('/')[0];
  const accessibleModules = sharedService.getAccessibleModules().map((m) => m.toLowerCase());

  console.log('Accessible Modules:', accessibleModules, 'Requested:', url);

  const isAccessible = accessibleModules.includes(url);

  if (isAccessible) {
    return true;
  } else {
    console.warn(`Access Denied to: ${url}`);
    router.navigate(['/access-denied']);
    return false;
  }
};

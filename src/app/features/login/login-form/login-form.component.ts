import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../../../core/services/token.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LoaderService } from '../../../core/services/loader.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-login-form',
  standalone: false,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private token: TokenService,
    private employeeservice: EmployeeService,
    private supabaseService: SupabaseService,
    private sharedService: SharedService,
    private router: Router,
    private alert:AlertService,
    private loader: LoaderService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    this.loginError = null;

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.loader.show();

      this.supabaseService.client.auth
        .signInWithPassword({
          email: username,
          password: password,
        })
        .then(async ({ data, error }) => {
          if (error || !data.session) {
            this.loginError = 'Invalid credentials';
            this.alert.sidePopUp('Invalid credentials','error');
            this.loader.hide();
            return;
          }

          const { access_token, refresh_token, user } = data.session;
          this.token.saveTokens(access_token, refresh_token);

          const employeeId = user.id;

          const { data: employeeData, error: empErr } = await this.supabaseService.client
            .from('employee')
            .select('*')
            .eq('refrences', employeeId)
            .single();

          if (empErr || !employeeData) {
            this.loginError = 'Employee fetch failed';
            this.loader.hide();
            this.alert.sidePopUp('Employee is not present in db','error');
            return;
          }

          this.loader.hide();
          this.router.navigate(['/dashboard']);
        })
        .catch((err) => {
          this.loginError = 'Something went wrong';
          this.alert.sidePopUp(err.message,'error');
          this.loader.hide();
        });
    }
  }
}

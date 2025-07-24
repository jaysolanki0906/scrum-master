import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
// import { Login } from '../../../core/models/login.model';

@Component({
  selector: 'app-login-form',
  standalone:false,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'] 
})
export class LoginFormComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private token: TokenService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // if (username === 'jay.solanki' && password === '123456') {
      //   this.auth.getTokenApi().subscribe({
      //     next: (res:any) => {
      //       this.token.saveTokens(res.access_token, res.refresh_token);
      //       console.log('Login successful',res);
      //     },
      //     error: (err:any) => {
      //       console.error('Login API failed:', err);
      //     }
      //   });
      // } else {
      //   console.warn('Invalid credentials');
      // }
    }
  }
}

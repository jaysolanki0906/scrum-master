import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../core/services/loader.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { AlertService } from '../../../core/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: false,
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  constructor(private fb: FormBuilder, private alert: AlertService, private router: Router, private employeeService: EmployeeService, private loaderService: LoaderService) { }
  ngOnInit(): void {
    this.initlizeForm();
  }
  initlizeForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['User'],
      refrences: ['']
    });
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loaderService.show();
    const { email, password } = this.registerForm.value;

    this.employeeService.createSupabaseUser(email, password).subscribe({
      next: (userId: string) => {
        // Correctly update just the `refrences` field
        this.registerForm.patchValue({ refrences: userId });

        const payload = this.registerForm.getRawValue();

        this.employeeService.addEmployee(payload).subscribe({
          next: () => {
            this.alert.sidePopUp('Registration successful', 'success');
            this.loaderService.hide();
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.alert.sidePopUp(`Employee add failed: ${err.message}`, 'error');
            this.loaderService.hide();
          },
        });
      },
      error: (err) => {
        this.alert.sidePopUp(`User creation failed: ${err.message}`, 'error');
        this.loaderService.hide();
      },
    });
  }

}

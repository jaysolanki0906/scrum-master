import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmployeeService } from '../../../core/services/employee.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alert: AlertService,
    private employeeService: EmployeeService, 
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.employeeForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(3)]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [
        data?.phoneNumber || '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      password: [
        data?.password || '',
        [Validators.required, Validators.minLength(6)],
      ],
    });

    if (this.data.mode === 'View' ) {
      this.employeeForm.disable();
    }
    console.log(data);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;

    const payload = this.employeeForm.value;

    if (this.data.mode === 'Edit') {
      this.employeeService.updateEmployee(this.data.id, payload).subscribe({
        next: () => {
          this.alert.sidePopUp('Employee updated successfully', 'success');
          this.dialogRef.close({ success: true });
        },
        error: (err:any) => {
          this.alert.sidePopUp(`Update failed: ${err}`, 'error');
        },
      });
    } else if (this.data.mode === 'Add') {
      this.employeeService.addEmployee(payload).subscribe({
        next: () => {
          this.alert.sidePopUp('Employee added successfully', 'success');
          this.dialogRef.close({ success: true });
        },
        error: (err) => {
          this.alert.sidePopUp(`Addition failed: ${err}`, 'error');
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

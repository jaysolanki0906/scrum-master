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
import Swal from 'sweetalert2';
import { ProjectsComponent } from '../projects/projects.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgDatesModule } from 'ng-dates';
import { ProductService } from '../../../core/services/product.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.scss',
})
export class ProjectDialogComponent {
  projectForm: FormGroup;
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private alert: AlertService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectForm = this.fb.group(
      {
        projectName: [
          data.projectName || '',
          [Validators.required, Validators.minLength(3)],
        ],
        description: [
          data.description || '',
          [Validators.required, Validators.minLength(10)],
        ],
        startDate: [data.startDate, Validators.required],
        endDate: [data.endDate, Validators.required],
        owner: [data.owner || '', Validators.required],
      },
      { validators: this.dateRangeValidator }
    );
    if (this.data.mode === 'View' || this.data.mode === 'Delete') {
      this.projectForm.disable();
    }
  }

  dateRangeValidator(form: FormGroup) {
    const start = form.get('startDate')?.value;
    const end = form.get('endDate')?.value;

    if (start && end && new Date(end) < new Date(start)) {
      form.get('endDate')?.setErrors({ dateRange: true });
      return { dateRange: true };
    }
    return null;
  }

  onSubmit(): void {
    if (!this.projectForm.valid) {
      return;
    }

    if (this.data.mode === 'Edit') {
      this.productService
        .editProject(this.data.id, this.projectForm.value)
        .subscribe({
          next: () => {
            this.alert.sidePopUp('Your data is sucessfully updated', 'success');
            this.dialogRef.close({ status: true });
          },
          error: (err) => {
            this.alert.sidePopUp(
              `Your data is sucessfully updated ${err}`,
              'success'
            );
          },
        });
    } else if (this.data.mode === 'Add') {
      this.productService.addProject(this.projectForm.value).subscribe({
        next: () => {
          this.alert.sidePopUp('Data added sucessfully', 'success');
          this.dialogRef.close({ status: true });
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

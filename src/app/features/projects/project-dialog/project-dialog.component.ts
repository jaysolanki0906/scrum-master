import { Component, Inject, OnInit } from '@angular/core';
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
import { EmployeeService } from '../../../core/services/employee.service';
import { LoaderService } from '../../../core/services/loader.service';

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
export class ProjectDialogComponent implements OnInit {
  projectForm: FormGroup;
  employeeList:{id:string,name:string}[]=[]
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private alert: AlertService,
    private employee:EmployeeService,
    private productService: ProductService,
    private loader:LoaderService,
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
  ngOnInit(): void {
    this.projectForm.get('startDate')?.valueChanges.subscribe((startDate) => {
    const endDateControl = this.projectForm.get('endDate');
    const endDate = endDateControl?.value;

    if (endDate && new Date(endDate) < new Date(startDate)) {
      endDateControl?.setValue(null); 
    }


    this.projectForm.updateValueAndValidity();
  });
      this.fetchEmployee();
  }
  fetchEmployee()
  {
    this.employee.getEmployees().subscribe({
    next:(res)=>{
      this.employeeList=res;
    }
    });
    console.log("this is list of owners",this.employeeList);
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
      this.projectForm.markAllAsTouched();
      return;
    }

    if (this.data.mode === 'Edit') {
      this.loader.show();
      this.productService
        .editProject(this.data.id, this.projectForm.value)
        .subscribe({
          next: () => {
            this.alert.sidePopUp('Your data is sucessfully updated', 'success');
            this.dialogRef.close({ status: true });
            this.loader.hide();
          },
          error: (err) => {
            this.alert.sidePopUp(err.message,'error');
            this.loader.hide();
          },
        });
    } else if (this.data.mode === 'Add') {
      this.loader.show();
      this.productService.addProject(this.projectForm.value).subscribe({
        next: () => {
          this.alert.sidePopUp('Data added sucessfully', 'success');
          this.dialogRef.close({ status: true });
          this.loader.hide();
        },
        error:(err)=>{this.loader.hide();this.alert.sidePopUp(err.message,'error');}
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

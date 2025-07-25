import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { LoggingEffortService } from '../../../core/services/logging-effort.service';
import { AlertService } from '../../../core/services/alert.service';
import { SharedService } from '../../../core/services/shared.service';
import { ProductService } from '../../../core/services/product.service';
import { SprintService } from '../../../core/services/sprint.service';

@Component({
  selector: 'app-logging-efforts-form',
  templateUrl: './logging-efforts-form.component.html',
  styleUrls: ['./logging-efforts-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoggingEffortsFormComponent implements OnInit {
  effortForm!: FormGroup;
  employeeList: any[] = [];
  taskList: any[] = [];
  employeeid: any;
  minDate: string = '';
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private loggin: LoggingEffortService,
    private taskService: TaskService,
    private alert: AlertService,
    private prod: ProductService,
    private shared: SharedService,
    private sprint: SprintService,
    private dialogRef: MatDialogRef<LoggingEffortsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.populateDropdowns();
    this.logCurrentTaskId();
    this.getDate();

    if (this.data?.taskMap) {
      const selectedTaskId =
        this.data?.taskid || Object.keys(this.data.taskMap)[0];

      if (selectedTaskId) {
        this.taskService.getTaskById(selectedTaskId).subscribe({
          next: (task) => {
            this.employeeid = task[0].assign_to;
            this.getEmployeeName(this.employeeid);
            this.effortForm.patchValue({ task_id: selectedTaskId });
          },
          error: (err) => console.error('Failed to fetch task', err),
        });
      }
    }

    this.populateEditForm(); // ✅ Called after safety checks
  }

  getDate() {
    const id = this.shared.getSelectedProjectId() || '';
    if (!id) return;

    this.prod.getProjectById(id).subscribe({
      next: (project: any) => {
        const start = new Date(project[0]?.startDate);
        const end = new Date(project[0]?.endDate);

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          this.minDate = start.toISOString().split('T')[0];
          this.maxDate = end.toISOString().split('T')[0];
          console.log('MinDate:', this.minDate, 'MaxDate:', this.maxDate);
        } else {
          console.warn('Invalid project dates');
        }
      },
      error: (err) => {
        console.error('Failed to fetch project dates', err);
      },
    });
  }

  preventInvalidKeys(event: KeyboardEvent) {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }

  populateEditForm() {
    if (this.data?.mode !== 'Edit' || !this.data?.effortData) return;

    console.log('Effort Data:', this.data.effortData);

    this.effortForm.patchValue({
      date: this.data.effortData.date,
      hours_spent: this.data.effortData.hours_spent,
      description: this.data.effortData.description,
    });
  }

  initForm() {
    this.effortForm = this.fb.group({
      date: ['', Validators.required],
      hours_spent: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      description: ['', Validators.required],
      logged_by: ['', Validators.required],
      task_id: ['', Validators.required],
    });

    this.effortForm.get('logged_by')?.disable();
    this.effortForm.get('task_id')?.disable();
  }

  populateDropdowns() {
    this.employeeList = Object.entries(this.data.employeeMap || {}).map(
      ([id, name]) => ({ id, name })
    );

    this.taskList = Object.entries(this.data.taskMap || {}).map(
      ([id, name]) => ({ id, name })
    );
  }

  logCurrentTaskId() {
    if (this.data?.id) {
      this.effortForm.patchValue({ task_id: this.data.id });
    }
  }

  getEmployeeName(id: string) {
    if (id) {
      this.effortForm.patchValue({
        logged_by: id,
      });
    }
  }

  onSubmit() {
    if (this.effortForm.invalid) {
      this.effortForm.markAllAsTouched();
      return;
    }

    const payload = this.effortForm.getRawValue();

    if (this.data.mode === 'Add') {
      this.loggin.addLogginEfforts(payload).subscribe({
        next: () => {
          this.alert.sidePopUp('Data added successfully', 'success');
          this.dialogRef.close({ status: true });
        },
        error: () => {
          this.alert.sidePopUp('There was an error', 'error');
          this.dialogRef.close({ status: false });
        },
      });
    } else if (this.data.mode === 'Edit') {
      this.loggin
        .editLogginEfforts(this.data.effortData.id, payload)
        .subscribe({
          next: () => {
            this.alert.sidePopUp('The value is updated', 'success');
            this.dialogRef.close({ status: true });
          },
          error: (err) => {
            this.alert.sidePopUp('There was an error', 'error');
            console.log('this is error', err);
            this.dialogRef.close({ status: false });
          },
        });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

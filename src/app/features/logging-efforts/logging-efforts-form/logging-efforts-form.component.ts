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
import { LoaderService } from '../../../core/services/loader.service';

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
    private loader: LoaderService,
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
        this.loader.show();
        this.taskService.getTaskById(selectedTaskId).subscribe({
          next: (task) => {
            this.employeeid = task[0].assign_to;
            this.getEmployeeName(this.employeeid);
            this.effortForm.patchValue({ task_id: selectedTaskId });
            this.loader.hide();
          },
          error: () => this.loader.hide(),
        });
      }
    }

    this.populateEditForm();
  }

  getDate() {
    const id = this.shared.getSelectedProjectId() || '';
    if (!id) return;

    this.loader.show();
    this.sprint.getSprintById(this.data.sprintId).subscribe({
      next: (project: any) => {
        const start = new Date(project.startDate);
        const end = new Date(project.endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          this.minDate = start.toISOString().split('T')[0];
          this.maxDate = end.toISOString().split('T')[0];
        }
        this.loader.hide();
      },
      error: () => this.loader.hide(),
    });
  }

  preventInvalidKeys(event: KeyboardEvent) {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }

  populateEditForm() {
    if (!this.data?.effortData) return;

    this.loader.show();
    this.effortForm.patchValue({
      date: this.data.effortData.date,
      hours_spent: this.data.effortData.hours_spent,
      description: this.data.effortData.description,
    });

    if (this.data?.mode === 'View') {
      this.effortForm.disable();
    }

    this.loader.hide();
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
    this.loader.show();

    if (this.data.mode === 'Add') {
      this.loggin.addLogginEfforts(payload).subscribe({
        next: () => {
          this.alert.sidePopUp('Data added successfully', 'success');
          this.dialogRef.close({ status: true });
          this.loader.hide();
        },
        error: (err) => {
          this.alert.sidePopUp(err.message,'error');
          this.dialogRef.close({ status: false });
          this.loader.hide();
        },
      });
    } else if (this.data.mode === 'Edit') {
      this.loggin
        .editLogginEfforts(this.data.effortData.id, payload)
        .subscribe({
          next: () => {
            this.alert.sidePopUp('The value is updated', 'success');
            this.dialogRef.close({ status: true });
            this.loader.hide();
          },
          error: (err) => {
            this.alert.sidePopUp(err.message,'error');
            this.dialogRef.close({ status: false });
            this.loader.hide();
          },
        });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

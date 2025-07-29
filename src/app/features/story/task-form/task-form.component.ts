import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from '../../../core/services/employee.service';
import { TaskService } from '../../../core/services/task.service';
import { AlertService } from '../../../core/services/alert.service';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  supabase: SupabaseClient;
  employeeList: any[] = [];
  storyList: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private taskservice: TaskService,
    private alert: AlertService,
    private loader:LoaderService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  ngOnInit(): void {
    this.initializeForm();
    console.log("this is data ",this.data)
    this.fetchEmployees();
  }

  initializeForm(): void {
    const task = this.data.taskData || {};

    this.taskForm = this.fb.group({
      title: [task.title || '', Validators.required],
      description: [task.description || '', Validators.required],
      type: [task.type || '', Validators.required],
      story_id: [this.data.id, Validators.required],
      assign_to: [task.assign_to || '', Validators.required],
      status: [task.status || '', Validators.required],
      points: [task.points || '', Validators.required],
      estimated_hours: [task.estimated_hours || '', Validators.required],
    });
    if(this.data.mode=='View')
    {
      this.taskForm.disable();
    }
  }

  fetchEmployees(): void {
    console.log("in fetch employee");
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employeeList = res;
      },
    });
  }
  preventInvalidKeys(event: KeyboardEvent) {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }


  onSubmit(): void {
    this.loader.show();
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.loader.hide();
      return;
    }
    if (this.data.mode == 'Add') {
      this.taskservice.addTask(this.taskForm.value).subscribe({
        next: () => {
          this.alert.sidePopUp('Data added sucessfully', 'success');
          this.dialogRef.close({status:true});
          this.loader.hide();
        },
        error: (err) => {
          this.alert.sidePopUp(err.message,'error');
          console.log('error', err);
          this.loader.hide();
        },
      });
    } else if (this.data.mode == 'Edit') {
      this.taskservice.editTask(this.data.taskData.id,this.taskForm.value).subscribe({
        next:()=>{
          this.alert.sidePopUp("Data is edited sucessfully",'success');
          this.dialogRef.close({status:true});
          this.loader.hide();
        },
        error:(err)=>{
          this.alert.sidePopUp(err.message,'error');
          this.loader.hide();
        }
      })
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
}

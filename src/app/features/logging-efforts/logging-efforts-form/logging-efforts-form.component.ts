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

  constructor(
    private fb: FormBuilder,
    private loggin:LoggingEffortService,
    private taskService: TaskService,
    private alert:AlertService,
    private dialogRef: MatDialogRef<LoggingEffortsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.populateDropdowns();
    this.logCurrentTaskId();
    this.populateEditForm();

    if (this.data?.taskMap ) {

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
  }

  preventInvalidKeys(event: KeyboardEvent) {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }
populateEditForm()
{
  console.log("this.data.effortData.date",this.data.effortData);
  this.effortForm.patchValue({
    date:this.data.effortData.date,
      hours_spent:this.data.effortData.hours_spent,
       description:this.data.effortData.description,
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
      logged_by: ['' , Validators.required],
      task_id: ['' , Validators.required],
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
      this.effortForm.patchValue({task_id: this.data.id });
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
    if(this.data.mode=='Add')
    {
      console.log(this.effortForm.getRawValue());
      this.loggin.addLogginEfforts(this.effortForm.getRawValue()).subscribe({
        next:()=>{this.alert.sidePopUp('Data added sucessfully','success');
          this.dialogRef.close({status:true});
        },
        error:()=>{
          this.alert.sidePopUp("their is some error",'error');
          this.dialogRef.close({status:false});
        }
      })
    }
    else(this.data.mode=='Edit')
    {
      this.loggin.editLogginEfforts(this.data.effortData.id,this.effortForm.getRawValue()).subscribe({
        next:()=>{this.alert.sidePopUp("The value is updated",'success');
          this.dialogRef.close({status:true});
        },
        error:(err)=>{
          this.alert.sidePopUp("their is some error",'error');
          console.log("this is eerror",err);
          this.dialogRef.close({status:false});
        }
      })
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

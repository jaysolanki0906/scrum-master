import { Component } from '@angular/core';
import { LoggingEffort } from '../../../core/models/loggingefforts.model';
import { AlertService } from '../../../core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { LoggingEffortService } from '../../../core/services/logging-effort.service';
import { LoggingEffortsFormComponent } from '../logging-efforts-form/logging-efforts-form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logging-efforts-list',
  standalone:false,
  templateUrl: './logging-efforts-list.component.html',
  styleUrl: './logging-efforts-list.component.scss'
})
export class LoggingEffortsListComponent {
loggingEfforts: LoggingEffort[] = [];
employeeMap: { [key: number]: string } = {};
taskMap: { [key: number]: string } = {};
id:any;

  constructor(
    private loggingEffortService: LoggingEffortService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {

     this.route.queryParamMap.subscribe(params => {
  this.id = params.get('taskId') || '';
});
console.log(this.id);

    this.fetchEfforts();
    this.getEmployeeName();
    this.getAllTasks();
  }

  getEmployeeName()
  {
    this.loggingEffortService.getAllEmployeesByName().subscribe({
      next:(res)=>{res.forEach(emp => {
        this.employeeMap[emp.id] = emp.name;  
      });}
    })
    console.log("this.employe",this.employeeMap);
  }
  getAllTasks() {
  this.loggingEffortService.getAllTasks().subscribe({
    next: (tasks) => {
      tasks.forEach(task => {
        this.taskMap[task.id] = task.title; 
      });
    },
    error: (err) => {
      console.error('Failed to fetch tasks', err);
    }
  });
}

  fetchEfforts() {
    this.loggingEffortService.getAllEfforts(this.id).subscribe({
      next: (data:LoggingEffort[]) => {
        this.loggingEfforts = data;
      },
      error: (err:any) => {
        console.error('Failed to load logging efforts:', err);
        this.alertService.sidePopUp('Could not fetch logging efforts','error');
      }
    });
  }

  add(): void {
    this.dialog.open(LoggingEffortsFormComponent,{
      width:'600px',
      data:{mode:'Add',employeeMap:this.employeeMap,taskMap:this.taskMap,taskid:this.id}
    }).afterClosed().subscribe({
      next:(res)=>{if(res.status){
        this.fetchEfforts();
        console.log("this is after fetch error and cloe dislog");
      }}
    })
  }

  edit(effort: LoggingEffort): void {
    this.dialog.open(LoggingEffortsFormComponent,{
      width:'600px',
      data:{mode:'Edit',employeeMap:this.employeeMap,taskMap:this.taskMap,taskid:this.id,effortData:effort}
    }).afterClosed().subscribe({
      next:(res)=>{if(res.status){

        this.fetchEfforts();
        console.log("this is after fetch error and cloe dislog");
      }}
    })
  }

  view(effort: LoggingEffort): void {
    this.dialog.open(LoggingEffortsFormComponent,{
      width:'600px',
      data:{mode:'View',employeeMap:this.employeeMap,taskMap:this.taskMap,taskid:this.id,effortData:effort}
    })
  }

  onDelete(effort: LoggingEffort): void {
    if (!confirm('Are you sure you want to delete this effort log?')) return;

    this.loggingEffortService.deleteLogginEfforts(effort.id.toString()).subscribe({
      next: () => {
        this.fetchEfforts();
        this.alertService.sidePopUp('Logging effort deleted successfully','success');

      },
      error: (err) => {
        console.error('Delete error:', err);
        this.alertService.sidePopUp('Failed to delete logging effort','success');
      }
    });
  }
}

import { Component } from '@angular/core';
import { LoggingEffort } from '../../../core/models/loggingefforts.model';
import { AlertService } from '../../../core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { LoggingEffortService } from '../../../core/services/logging-effort.service';
import { LoggingEffortsFormComponent } from '../logging-efforts-form/logging-efforts-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TruncateWordsPipe } from '../../../pipes/truncate-words.pipe';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../core/services/loader.service';
import { CommonTableComponent } from '../../../shared/common-table/common-table.component';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-logging-efforts-list',
  imports: [CommonModule,CommonTableComponent],
  templateUrl: './logging-efforts-list.component.html',
  styleUrl: './logging-efforts-list.component.scss',
})
export class LoggingEffortsListComponent {
  loggingEfforts: LoggingEffort[] = [];
  effortHeaders: string[] = ['Date', 'Hours Spent', 'Description', 'Logged By', 'Task Name'];
  effortKeys: string[] = ['date', 'hours_spent', 'description', 'logged_by', 'task_id'];

  employeeMap: { [key: number]: string } = {};
  taskMap: { [key: number]: string } = {};
  id: string = '';
  sprintId: string = '';
  status: boolean = false;

  constructor(
    private loggingEffortService: LoggingEffortService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router:Router,
    private shared:SharedService,
    private alertService: AlertService,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.id = params.get('taskId') || '';
      this.sprintId = params.get('sprintId') || '';
    });
    this.fetchEfforts();
    this.getEmployeeName();
    this.getAllTasks();
  }

  getEmployeeName() {
    this.loader.show();
    this.loggingEffortService.getAllEmployeesByName().subscribe({
      next: (res) => {
        res.forEach((emp) => {
          this.employeeMap[emp.id] = emp.name;
        });
        this.loader.hide();
      },
      error: () => this.loader.hide(),
    });
  }

  getAllTasks() {
    this.loader.show();
    this.loggingEffortService.getAllTasks().subscribe({
      next: (tasks) => {
        tasks.forEach((task) => {
          this.taskMap[task.id] = task.title;
        });
        this.loader.hide();
      },
      error: () => this.loader.hide(),
    });
  }

  fetchEfforts() {
  const userId = this.shared.getUserId();  // logged-in user's ID
  if (!userId) return;

  this.loader.show();

  this.loggingEffortService.getAllEfforts(this.id, userId).subscribe({
    next: (data: LoggingEffort[]) => {
      this.loggingEfforts = data;
      this.loader.hide();
    },
    error: (err: any) => {
      console.error('Failed to load logging efforts:', err);
      this.alertService.sidePopUp('Could not fetch logging efforts', 'error');
      this.loader.hide();
    },
  });
}


  add(): void {
    this.dialog
      .open(LoggingEffortsFormComponent, {
        width: '600px',
        data: {
          mode: 'Add',
          employeeMap: this.employeeMap,
          taskMap: this.taskMap,
          taskid: this.id,
          sprintId: this.sprintId,
        },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.fetchEfforts();
          }
        },
      });
  }

  edit(effort: any): void {
    this.dialog
      .open(LoggingEffortsFormComponent, {
        width: '600px',
        data: {
          mode: 'Edit',
          employeeMap: this.employeeMap,
          taskMap: this.taskMap,
          taskid: this.id,
          effortData: effort,
          sprintId: this.sprintId,
        },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.fetchEfforts();
          }
        },
      });
  }

  view(effort: any): void {
    this.dialog.open(LoggingEffortsFormComponent, {
      width: '600px',
      data: {
        mode: 'View',
        employeeMap: this.employeeMap,
        taskMap: this.taskMap,
        taskid: this.id,
        effortData: effort,
      },
    });
  }

  async onDelete(effort: any) {
    const confirmed = await this.alertService.confirmDelete();

    if (confirmed) {
      this.loader.show();
      this.loggingEffortService.deleteLogginEfforts(effort.id.toString()).subscribe({
        next: () => {
          this.fetchEfforts();
          this.alertService.sidePopUp('Logging effort deleted successfully', 'success');
          this.loader.hide();
        },
        error: (err) => {
          console.error(`Delete error:${err.message}`, err);
          this.alertService.sidePopUp('Failed to delete logging effort', 'error');
          this.loader.hide();
        },
      });
    }
  }
}

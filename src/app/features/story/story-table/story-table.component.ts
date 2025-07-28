import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StoryService } from '../../../core/services/story.service';
import { Story } from '../../../core/models/story.model';
import { AlertService } from '../../../core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { StoryFormComponent } from '../story-form/story-form.component';
import { SprintService } from '../../../core/services/sprint.service';
import { SharedService } from '../../../core/services/shared.service';
import { Sprint } from '../../../core/models/sprint.model';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Route, Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-story-table',
  standalone: false,
  templateUrl: './story-table.component.html',
  styleUrls: ['./story-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StoryTableComponent implements OnInit {
  storyList: Story[] = [];
  sprintList: Sprint[] = [];
  taskList: Task[] = [];
  employeeList:Employee[]=[];
  hoveredTaskId: number | null = null;
  selectedSprint!: Sprint;

  constructor(
    private shared: SharedService,
    private employee:EmployeeService,
    private story: StoryService,
    private alert: AlertService,
    private dialog: MatDialog,
    private task: TaskService,
    private router: Router,
    private sprint: SprintService
  ) {}

  ngOnInit(): void {
    this.getAllSprint();
    this.changeInDropdown();
    this.getEmployeeList();
  }
  getEmployeeList()
  {
    this.employee.getEmployees().subscribe({
      next:(res)=>{
        this.employeeList=res;
      },
      error:(err)=>{
        this.alert.sidePopUp('Yo got some error while fetching Employees','error');
        console.log('error',err)
      }
    })
  }
  getEmployeeName(id:number|undefined):string|null{
    const emp=this.employeeList.find((e)=>String(e.id)==String(id));
    return emp?emp.name:null;
  }

  changeInDropdown() {
    this.shared.selectedProjectId$.subscribe((projectId) => {
      console.log('Project ID changed:', projectId);
      if (projectId) {
        this.getAllSprint();
      }
    });
  }

  getTasksByStatus(tasks: Task[] | undefined, status: string) {
    if (!tasks) return [];
    return tasks.filter((task) => task.status === status);
  }

 getAllSprint() {
  const id = this.shared.getSelectedProjectId() || '';
  const prevSelectedSprintId = this.selectedSprint?.id;

  this.sprint.getSprint(id).subscribe({
    next: (res: Sprint[]) => {
      this.sprintList = res;

      if (res.length > 0) {
        const matchedSprint = res.find(s => s.id === prevSelectedSprintId);

        if (matchedSprint) {
          this.selectedSprint = matchedSprint;
        } else {
          this.selectedSprint = res[0]; 
        }

        this.getAllStory(this.selectedSprint.id.toString());
      }
    },
    error: (err) => {
      this.alert.sidePopUp('Error fetching sprint data', 'error');
      console.log('this is error in sprint ', err);
    },
  });
}

  onSprintChange(event: any) {
    console.log('Sprint changed:', this.selectedSprint);
    this.getAllStory(event.id);
  }

  getAllStory(sprintId: string) {
    this.story.getStory(sprintId).subscribe({
      next: (stories: Story[]) => {
        let loaded = 0;
        if (!stories.length) {
          this.storyList = [];
          return;
        }
        stories.forEach((story, idx) => {
          this.task.getTask(story.id.toString()).subscribe({
            next: (res) => {
              story.tasks = res.data || [];
              loaded++;
              if (loaded === stories.length) {
                this.storyList = stories;
              }
            },
            error: (err) => {
              story.tasks = [];
              loaded++;
              if (loaded === stories.length) {
                this.storyList = stories;
              }
              console.error('Error loading tasks for story', story.id, err);
            },
          });
        });
      },
      error: (err) => {
        this.alert.sidePopUp('You got some error', 'error');
        console.log('error', err);
        this.storyList = [];
      },
    });
  }

  editDialog(event: Story) {
    const sprintid = this.selectedSprint.id;
    this.dialog
      .open(StoryFormComponent, {
        width: '600px',
        data: { mode: 'Edit', id: sprintid, storyData: event },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res?.success) {
            this.getAllStory(this.selectedSprint.id.toString());
          }
        },
      });
  }

  async deleteDialog(event: Story) {
     const confirmed = await this.alert.confirmDelete();
    this.story.deleteStory(event.id.toString()).subscribe({
      next: () => {
        this.alert.sidePopUp('This record is deleted', 'success');
        this.getAllSprint();
      },
    });
  }

  addTask(event: Story) {
    this.dialog
      .open(TaskFormComponent, {
        width: '600px',
        data: { mode: 'Add', id: event.id },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.getAllSprint();
          }
        },
      });
  }

  async onDeleteTask(t: Task) {
    const confirmed = await this.alert.confirmDelete();
    if(confirmed){
    this.task.deleteTask(t.id.toString()).subscribe({
      next: () => {
        this.getAllSprint();
      },
      error: (err) => {
        console.log('the error while deleting', err);
      },
    });}
  }
  loggingEffort(task: Task): void {
  this.router.navigate(['scrum-board/logging'], {
    queryParams: {
      taskId: task.id,
      sprintId: this.selectedSprint?.id 
    },
  });
}


  onEditTask(task: Task) {
    this.dialog
      .open(TaskFormComponent, {
        width: '600px',
        data: { mode: 'Edit', id: task.story_id, taskData: task },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.getAllSprint();
          }
        },
      });
  }

  onViewTask(task: Task) {
    this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { mode: 'View', id: task.story_id, taskData: task },
    });
  }

  addStoryDialog() {
    const sprintid = this.selectedSprint.id;
    this.dialog
      .open(StoryFormComponent, {
        width: '600px',
        data: { mode: 'Add', id: sprintid },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res?.success) {
            this.getAllStory(this.selectedSprint.id.toString());
          }
        },
      });
  }
}

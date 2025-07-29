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
import { DndDropEvent } from 'ngx-drag-drop';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-story-table',
  templateUrl: './story-table.component.html',
  styleUrls: ['./story-table.component.scss'],
  standalone:false,
  encapsulation: ViewEncapsulation.None,
})
export class StoryTableComponent implements OnInit {
  storyList: Story[] = [];
  sprintList: Sprint[] = [];
  taskList: Task[] = [];
  employeeList: Employee[] = [];
  hoveredTaskId: number | null = null;
  selectedSprint!: Sprint;
  draggedTask: any;
  draggedStory: any;
  draggedColumn: string='';

  constructor(
    private shared: SharedService,
    private employee: EmployeeService,
    private story: StoryService,
    private alert: AlertService,
    private dialog: MatDialog,
    private task: TaskService,
    private router: Router,
    private sprint: SprintService,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.getAllSprint();
    this.changeInDropdown();
    this.getEmployeeList();
  }

  getEmployeeList() {
    this.loader.show();
    this.employee.getEmployees().subscribe({
      next: (res) => {
        this.employeeList = res;
        this.loader.hide();
      },
      error: (err) => {
        this.alert.sidePopUp(err.message, 'error');
        this.loader.hide();
      }
    });
  }

  getEmployeeName(id: number | undefined): string | null {
    const emp = this.employeeList.find((e) => String(e.id) == String(id));
    return emp ? emp.name : null;
  }

  changeInDropdown() {
    this.shared.selectedProjectId$.subscribe((projectId) => {
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
    this.loader.show();
    const id = this.shared.getSelectedProjectId() || '';
    const prevSelectedSprintId = this.selectedSprint?.id;

    this.sprint.getSprint(id).subscribe({
      next: (res: Sprint[]) => {
        this.sprintList = res;
        if (res.length > 0) {
          const matchedSprint = res.find(s => s.id === prevSelectedSprintId);
          this.selectedSprint = matchedSprint ? matchedSprint : res[0];
          this.getAllStory(this.selectedSprint.id.toString());
        }
        this.loader.hide();
      },
      error: (err) => {
        this.alert.sidePopUp('Error fetching sprint data', 'error');
        this.loader.hide();
      },
    });
  }

  onSprintChange(event: any) {
    this.getAllStory(event.id);
  }

  onDragStart(event: DragEvent, task: any, story: any, column: string) {
    this.draggedTask = task;
    this.draggedStory = story;
    this.draggedColumn = column;
    event.dataTransfer?.setData('text/plain', JSON.stringify({taskId: task.id}));
    console.log("Dragged task:", this.draggedTask, "from story:", this.draggedStory, "in column:", this.draggedColumn);
  }

  onDragOver(event: DragEvent) {
    console.log("This is sragged task",event);
    event.preventDefault();
  }
  onDrop(event: DragEvent, story: any, newColumn: string) {
  event.preventDefault();

  if (this.draggedTask && this.draggedStory === story) {
    if (this.draggedTask.status !== newColumn) {
      const payload = { ...this.draggedTask, status: newColumn };
      this.task.editStatusTask(this.draggedTask.id.toString(), payload).subscribe({
        next: () => {
          this.getAllStory(this.selectedSprint.id.toString());
        },
        error: (err: any) => {
          this.alert.sidePopUp(err.message, 'error');
        }
      });
    } else {
      this.alert.sidePopUp('Task already in ' + newColumn + ' column', 'warning');
    }
  }

  this.draggedTask = null;
  this.draggedStory = null;
  this.draggedColumn = '';
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
            },
          });
        });
      },
      error: (err) => {
        this.alert.sidePopUp(err.message, 'error');
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
    if (confirmed) {
      this.story.deleteStory(event.id.toString()).subscribe({
        next: () => {
          this.alert.sidePopUp('This record is deleted', 'success');
          this.getAllSprint();
        },
        error: (err) => {
          this.alert.sidePopUp(err.message, 'error');
        }
      });
    }
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
    if (confirmed) {
      this.task.deleteTask(t.id.toString()).subscribe({
        next: () => {
          this.getAllSprint();
        },
        error: (err) => {
          this.alert.sidePopUp(err.message, 'error');
        },
      });
    }
  }

  loggingEffort(task: Task): void {
    const id = this.shared.getUserId();
    if (id == task.assign_to?.toString()) {
      this.router.navigate(['scrum-board/logging'], {
        queryParams: {
          taskId: task.id,
          sprintId: this.selectedSprint?.id
        },
      });
    }
    else {
      this.alert.sidePopUp('You are not authorized to log efforts for this task', 'error');
    }
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
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { projectDropDown, Sprint } from '../../../core/models/sprint.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { SprintService } from '../../../core/services/sprint.service';
import { MatDialog } from '@angular/material/dialog';
import { SprintFormComponent } from '../sprint-form/sprint-form.component';
import { SharedService } from '../../../core/services/shared.service';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-sprint-table',
  standalone: false,
  templateUrl: './sprint-table.component.html',
  styleUrls: ['./sprint-table.component.scss'],
})
export class SprintTableComponent implements OnInit {
  form!: FormGroup;
  dropdown: projectDropDown[] = [];
  sprintList: any = [];
  sprintHeaders: string[] = ['Sprint Name', 'Goal', 'Start Date', 'End Date', 'Status'];
sprintKeys: string[] = ['sprintName', 'goal', 'startDate', 'endDate', 'status'];

  startDate: Date = new Date();
  endDate: Date = new Date();
  dropdownSettingsvar: any = [];

  constructor(
    private fb: FormBuilder,
    private project: ProductService,
    private sprint: SprintService,
    private alert: AlertService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      selectedProject: [null, Validators.required],
    });
    this.dropdownData();
    this.getSprintData();
    this.changeInDropdown();
    this.getProjectDate();
  }

  getProjectDate() {
    const id = this.sharedService.getSelectedProjectId() || '';
    if (!id) return;

    this.loader.show();
    this.project.getProjectById(id).subscribe({
      next: (res) => {
        this.startDate = res[0].startDate;
        this.endDate = res[0].endDate;
        this.loader.hide();
      },
      error: () => {
        this.loader.hide();
        this.alert.sidePopUp('Failed to load project dates', 'error');
      },
    });
  }

  changeInDropdown() {
    this.sharedService.selectedProjectId$.subscribe((id) => {
      console.log('Project ID changed:', id);
      if (id) {
        this.getSprintData();
      }
    });
  }

  getSprintData() {
    const selectedProjectId = this.sharedService.getSelectedProjectId();

    if (selectedProjectId) {
      this.loader.show();
      this.sprint.getSprint(selectedProjectId).subscribe({
        next: (res: any) => {
          this.sprintList = res;
          this.loader.hide();
          console.log('Sprint list:', this.sprintList);
        },
        error: () => {
          this.loader.hide();
          this.alert.sidePopUp('Failed to load sprint data', 'error');
        },
      });
    } else {
      this.alert.sidePopUp('Please select a project from header', 'warning');
    }
  }

  AddSprint() {
    const selectedProject = this.form.value.selectedProject?.[0];
    this.dialog
      .open(SprintFormComponent, {
        width: '600px',
        data: {
          mode: 'Add',
          projectStartDate: this.startDate,
          projectEndDate: this.endDate,
        },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res?.success === true) {
            this.form.setValue({
              selectedProject: [
                {
                  id: res.dropdownid,
                  projectName: res.dropdownName,
                },
              ],
            });
            console.log('Patched selectedProject:', this.form.value);
            this.getSprintData();
          }
        },
      });
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  edit(sprint: Sprint) {
    this.dialog
      .open(SprintFormComponent, {
        width: '600px',
        data: { ...sprint, mode: 'Edit' },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res?.success === true) {
            this.getSprintData();
          }
        },
      });
  }

  view(sprint: Sprint) {
    this.dialog.open(SprintFormComponent, {
      width: '600px',
      data: { ...sprint, mode: 'View' },
    });
  }

  async Delete(sprint: Sprint) {
    const confirmed = await this.alert.confirmDelete();
    if (confirmed) {
      this.loader.show();
      this.sprint.deleteSprint(sprint.id).subscribe({
        next: () => {
          this.loader.hide();
          this.alert.sidePopUp('Sprint deleted successfully', 'success');
          this.getSprintData();
        },
        error: (error) => {
          this.loader.hide();
          this.alert.sidePopUp(error.message,'error');
          console.error(error);
        },
      });
    }
  }

  dropdownData() {
    this.loader.show();
    this.project.getProjectsData().subscribe({
      next: (res) => {
        this.dropdown = res.map((data) => ({
          id: data.id,
          projectName: data.projectName,
        }));
        this.loader.hide();
      },
      error: (err) => {
        this.loader.hide();
        this.alert.sidePopUp(err.message,'error');
      },
    });
  }
}

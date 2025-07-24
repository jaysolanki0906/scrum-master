import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { projectDropDown, Sprint } from '../../../core/models/sprint.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { SprintService } from '../../../core/services/sprint.service';
import { MatDialog } from '@angular/material/dialog';
import { SprintFormComponent } from '../sprint-form/sprint-form.component';
import { SharedService } from '../../../core/services/shared.service';

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
  dropdownSettingsvar: any = [];

  constructor(
    private fb: FormBuilder,
    private project: ProductService,
    private sprint: SprintService,
    private alert: AlertService,
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      selectedProject: [null, Validators.required],
    });
    this.dropdownSettings();
    this.dropdownData();
    this.getSprintData();
    this.changeInDropdown();
  }
  changeInDropdown()
  {
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
    this.sprint.getSprint(selectedProjectId).subscribe({
      next: (res: any) => {
        this.sprintList = res;
        console.log('this.sp', this.sprintList);
        if (this.sprintList.length > 0) {
          this.alert.sidePopUp('Sprint data loaded successfully', 'success');
        } else {
          this.alert.sidePopUp('No sprint data found', 'info');
        }
      },
      error: () => {
        this.alert.sidePopUp('Failed to load sprint data', 'error');
      },
    });
  } else {
    this.alert.sidePopUp('Please select a project from header', 'warning');
  }
}

  dropdownSettings() {
    this.dropdownSettingsvar = {
      singleSelection: true,
      idField: 'id',
      textField: 'projectName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  AddSprint() {
    const selectedProject = this.form.value.selectedProject?.[0];
    this.dialog
      .open(SprintFormComponent, {
        width: '600px',
        data: { mode: 'Add' },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.success == true) {
            this.form.setValue({
              selectedProject: [
                {
                  id: res.dropdownid,
                  projectName:res.dropdownName
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
          if (res.success == true) {
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
  Delete(sprint: Sprint) {
    this.sprint.deleteSprint(sprint.id).subscribe({
      next: () => {
        this.alert.sidePopUp(
          'Congratulations your sprint is deleted',
          'success'
        );
        this.getSprintData();
      },
      error: (error) => {
        this.alert.sidePopUp(
          'Call your devloper and tell him to check error in console',
          'error'
        );
        console.log(error);
      },
    });
  }

  dropdownData() {
    this.project.getProjectsData().subscribe({
      next: (res) => {
        this.dropdown = res.map((data) => ({
          id: data.id,
          projectName: data.projectName,
        }));
      },
      error: () => {
        this.alert.sidePopUp('Sorry, no data found', 'error');
      },
    });
  }
}

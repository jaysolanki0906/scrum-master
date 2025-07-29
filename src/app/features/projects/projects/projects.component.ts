import { Component, OnInit, PipeTransform } from '@angular/core';
import { Project } from '../../../core/models/project.model';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../../core/services/product.service';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { AlertService } from '../../../core/services/alert.service';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];
  employeeList: Employee[] = [];

  searchText: string = '';

  constructor(
    private product: ProductService,
    private dialog: MatDialog,
    private alert: AlertService,
    private employee: EmployeeService,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.getEmployee();
  }

  getEmployee() {
    this.loaderService.show();
    this.employee.getEmployees().subscribe({
      next: (res) => {
        this.employeeList = res;
        console.log('Employee list loaded:', this.employeeList);
        this.loaderService.hide();
      },
      error: (err) => {
        this.alert.sidePopUp(err.message,'error');
        this.loaderService.hide();
      }
    });
  }

  getOwnerName(id: string): string | null {
    const emp = this.employeeList.find((e) => String(e.id) === String(id));
    return emp ? emp.name : null;
  }

  fetchProjects() {
    this.product.getProjectsData().subscribe({
      next: (res) => {
        this.projects = res;
        console.log(res);
        
      },
      error: (err) => {
        this.alert.sidePopUp(err.message,'error');
      }
    });
  }

  edit(project: any) {
   
    this.dialog.open(ProjectDialogComponent, {
      width: '600px',
      data: { ...project, mode: 'Edit' }
    }).afterClosed().subscribe({
      next: (res) => {
        if (res?.status === true) {
          this.fetchProjects();
        }
        
      },
      error: (err) => {
        this.alert.sidePopUp(err.message,'error');
      }
    });
  }

  async onDelete(project: any) {
    const confirmed = await this.alertService.confirmDelete();
    if (confirmed) {
      this.loaderService.show();
      this.product.deleteProject(project.id).subscribe({
        next: () => {
          this.alert.sidePopUp('Delete happened successfully', 'success');
          this.fetchProjects();
          this.loaderService.hide();
        },
        error: (err) => {
          this.alert.sidePopUp(err.message,'error');
          this.loaderService.hide();
        }
      });
    } else {
      this.loaderService.hide(); 
    }
  }

  add() {
    this.dialog.open(ProjectDialogComponent, {
      width: '600px',
      data: { mode: 'Add' }
    }).afterClosed().subscribe({
      next: (res) => {
        if (res?.status === true) {
          this.fetchProjects();
        }
      },
      error: (err) => {
        this.alert.sidePopUp(err.message,'error');
      }
    });
  }

  view(project: any) {
    this.dialog.open(ProjectDialogComponent, {
      width: '600px',
      data: { ...project, mode: 'View' }
    });
  }
}

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

  constructor(private product: ProductService,
    private dialog: MatDialog,
    private alert: AlertService,
    private employee: EmployeeService,
    private loaderService: LoaderService,
    private alertService: AlertService) { }

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
      },
      error: (err) => {
        console.error('Failed to fetch employees', err);
      }
    });
    this.loaderService.hide();
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
      error: (error) => {
        this.projects = error;
      }
    });
  }

  edit(project: any) {
    this.dialog.open(ProjectDialogComponent, {
      width: '600px',
      data: { ...project, mode: "Edit" }
    }).afterClosed().subscribe({
      next: (res) => {
        if (res.status == true)
          this.fetchProjects();
        console.log('it is closed');
      }
    });
  }

  async onDelete(project: any) {
    const confirmed = await this.alertService.confirmDelete();
    if (confirmed) {
      this.product.deleteProject(project.id).subscribe({
        next: () => { this.alert.sidePopUp("Delete happened sucessfully", 'success'); this.fetchProjects() },
        error: () => { this.alert.sidePopUp("Error happned while delete", 'error') }
      });
    }

  }

  add() {
    this.dialog.open(ProjectDialogComponent, {
      width: '600px',
      data: { mode: 'Add' }
    }).afterClosed().subscribe({
      next: (res) => {
        if (res.status == true)
          this.fetchProjects();
        console.log('it is closed');
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

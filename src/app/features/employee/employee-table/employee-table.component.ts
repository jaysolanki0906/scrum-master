import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../core/services/alert.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { LoaderService } from '../../../core/services/loader.service'; 
import { filter } from 'rxjs';

@Component({
  selector: 'app-employee-table',
  standalone: false,
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.scss',
})
export class EmployeeTableComponent {
  employees: Employee[] = [];
  searchText: string = '';
  
   searchFields = [
    { label: 'User Type', key: 'status', type: 'select', options: ['User', 'Admin'] },
  ];
  values = {
    status: ''
  };

  constructor(
    private dialog: MatDialog,
    private employeeServices: EmployeeService,
    private alert: AlertService,
    private loaderService: LoaderService 
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees() {
     const filters = {
    ...this.values,
  };
    this.loaderService.show();
    this.employeeServices.getEmployees(filters).subscribe({
      next: (res) => {
        this.employees = res;
        console.log('this.employees', this.employees);
        this.alert.sidePopUp('All employees fetched successfully', 'success');
        this.loaderService.hide(); 
      },
      error: (err) => {
        this.alert.sidePopUp(err.message,'error');
        this.loaderService.hide(); 
      },
    });
  }
  onFilter(data: any) {
    console.log('Filter data:', data);
    this.values = data;
    this.fetchEmployees();
  }
  onClear() {
    this.values = {
      status: '',
    };
    this.searchText = '';
    this.fetchEmployees();
  }
  edit(employee: any) {
    
    this.dialog
      .open(EmployeeFormComponent, {
        width: '600px',
        data: { mode: 'Edit', ...employee },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res?.success === true) this.fetchEmployees();
        },
        error: (err) => {
          this.alert.sidePopUp(err.message,'error');
        },
      });
  }

  async onDelete(employee: any) {
     const confirmed = await this.alert.confirmDelete();
     if(confirmed){
      this.loaderService.show();
    this.employeeServices.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.alert.sidePopUp(
          'This data is successfully deleted',
          'success'
        );
        this.fetchEmployees();
        this.loaderService.hide(); 
      },
      error: (err) => {
        this.alert.sidePopUp(err.message, 'error');
        console.log('error', err);
        this.loaderService.hide();
      },
    });}
  }

  add() {
    
    this.dialog
      .open(EmployeeFormComponent, {
        width: '600px',
        data: { mode: 'Add' },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res?.success === true) this.fetchEmployees();
          
        },
        error: (err) => {
          this.alert.sidePopUp(err.message,'error');
        },
      });
  }

  view(employee: any) {
    this.dialog.open(EmployeeFormComponent, {
      width: '600px',
      data: { mode: 'View', ...employee },
    });
  }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../core/services/alert.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-table',
  standalone:false,
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.scss'
})
export class EmployeeTableComponent {
   employees:Employee[]=[];
  
    searchText: string = '';
  
    constructor(private dialog: MatDialog,private employeeServices:EmployeeService,private alert:AlertService) {}
  
    ngOnInit(): void {
      this.fetchEmployees();
    }
    fetchEmployees()
    {
      this.employeeServices.getEmployees().subscribe({
        next:(res)=>{
          this.employees=res;
          console.log('this.employees',this.employees);
          this.alert.sidePopUp('All employees fetched sucessfully','success');
        },
        error:()=>{
          this.alert.sidePopUp('Sorry at the moment their is some issue','error');
        }
      })
    }
  
    edit(project:any) {
      this.dialog.open(EmployeeFormComponent,{
        width:'600px',
        data:{mode:'Edit',...project}
      }).afterClosed().subscribe({
        next:(res)=>{
          if(res.success==true)this.fetchEmployees()}
      })
    }
  
    onDelete(project:any) {
      this.employeeServices.deleteEmployee(project.id).subscribe({
        next:()=>{
          this.alert.sidePopUp('This data is sucessfully delete','success');
          this.fetchEmployees();
        },
        error:(err)=>{
          this.alert.sidePopUp('Sorry some error occured','error');
          console.log("error",err);
        }
      })
    }
  
    add()
    {
      this.dialog.open(EmployeeFormComponent,{
        width:'600px',
        data:{mode:'Add'}
      }).afterClosed().subscribe({
        next:(res)=>{
          if(res.success==true)this.fetchEmployees()}
      })
    }
  
    view(project:any) {
      this.dialog.open(EmployeeFormComponent,{
        width:'600px',
        data:{mode:'View',...project}
      })
    }
}

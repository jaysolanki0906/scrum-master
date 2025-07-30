import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaskTextPipe } from '../../pipes/mask-text.pipe';
import { CommonModule } from '@angular/common';
import { TruncateWordsPipe } from '../../pipes/truncate-words.pipe';
import { LoaderService } from '../../core/services/loader.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { AlertService } from '../../core/services/alert.service';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-common-table',
  imports: [MaskTextPipe,CommonModule,TruncateWordsPipe],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.scss'
})
export class CommonTableComponent implements OnInit{

  employeeList:Employee[]=[];
  @Input() headers: string[] = [];
  @Input() keys: string[] = [];
  @Input() data: any[] = [];
  @Input() taskMap:{ [key: number]: string } = {};
  @Input() title:string='';

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  constructor(private loaderService:LoaderService,private alert:AlertService,private employee:EmployeeService){}
ngOnInit(): void {
    this.getEmployee();
    console.log("this is title",this.title);
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
  getOwnerName(ownerId: string) {
   const emp = this.employeeList.find((e) => String(e.id) === String(ownerId));

    return emp ? emp.name : "unknown";
  }
  getTaskName(taskId: number | string): string {
  return this.taskMap[Number(taskId)] || 'Unknown';
}

}

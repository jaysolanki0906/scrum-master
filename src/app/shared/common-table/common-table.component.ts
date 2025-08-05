import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MaskTextPipe } from '../../pipes/mask-text.pipe';
import { CommonModule } from '@angular/common';
import { TruncateWordsPipe } from '../../pipes/truncate-words.pipe';
import { LoaderService } from '../../core/services/loader.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { AlertService } from '../../core/services/alert.service';
import { Task } from '../../core/models/task.model';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-common-table',
  imports: [MaskTextPipe, CommonModule, TruncateWordsPipe, MatPaginatorModule,
    MatTableModule, FormsModule],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.scss'
})
export class CommonTableComponent implements OnInit {

  employeeList: Employee[] = [];
  searchTerm: string = '';
  searchtermtemp: string = '';
  @Input() headers: string[] = [];
  @Input() keys: string[] = [];
  @Input() data: any[] = [];
  @Input() taskMap: { [key: number]: string } = {};
  @Input() title: string = '';
  @Input() fields: any[] = [];
  @Input() field!: any;
  @Input() values!: { [key: string]: any };


  @Output() add = new EventEmitter<void>();
  @Output() searchClicked = new EventEmitter<string>();
  @Output() edit = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  @Output() filter = new EventEmitter<any>();
  @Output() clear = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pagedData: any[] = [];

  pageSize = 3;
  filteredData: any[] = [];
  currentPage: number = 0;
  totalItems: number = 0;
  constructor(private loaderService: LoaderService, private alert: AlertService, private employee: EmployeeService) { }
  ngOnInit(): void {
    this.getEmployee();
    console.log("this is title", this.title);
    this.setPagedData();
    console.log()
  }
  ngOnChanges() {
    this.setPagedData();
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPagedData();
  }
  clearSearch() {
    console.log("This is all values", this.values);
    this.searchTerm = '';

    this.values = {};
    this.clear.emit();
    this.emitFilter();
  }
  onSearchChange() { }
  setPagedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedData = this.data.slice(startIndex, endIndex);
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
        this.alert.sidePopUp(err.message, 'error');
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


  emitFilter() {
  const term = this.searchTerm?.trim() || '';
  this.searchtermtemp = term;

  const filterData = {
    ...this.values,
    search: term  
  };

  this.filter.emit(filterData);
}


}

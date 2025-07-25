import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../core/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-profile-form',
  standalone:false,
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})
export class ProfileFormComponent implements OnInit {
  profileForm!: FormGroup;
  id:string='';

  constructor(private fb: FormBuilder,private alert:AlertService,private shared:SharedService,private employee:EmployeeService) {}

 ngOnInit(): void {
  this.profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/), 
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/),
      ],
    ],
  });

  this.getEmployee();
}

  getEmployee()
  {
    this.id=this.shared.getUserId()||"";
    this.employee.getPerticularEmployee(this.id).subscribe({
      next:(res)=>{this.profileForm.patchValue({
         name: res[0].name,
      email: res[0].email,
      phoneNumber: res[0].phoneNumber,
      password: res[0].password,
      })}
  })
  }

  onSubmit() {

    if (this.profileForm.invalid) {
     this.profileForm.markAllAsTouched();
     return;
    }
    this.employee.updateEmployee(this.id,this.profileForm.getRawValue()).subscribe({
      next:()=>{this.alert.sidePopUp("Vlaues saved sucessfully",'success');},
      error:()=>{this.alert.sidePopUp('you got soem error please check','error');}
    })
  }
  
}

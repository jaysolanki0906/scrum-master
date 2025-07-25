import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../core/services/product.service';
import { projectDropDown } from '../../../core/models/sprint.model';
import { AlertService } from '../../../core/services/alert.service';
import { SprintService } from '../../../core/services/sprint.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-sprint-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sprint-form.component.html',
  styleUrls: ['./sprint-form.component.scss'],
})
export class SprintFormComponent implements OnInit {
  sprintForm!: FormGroup;
  minDate!: string;
  maxDate!: string;
  dropdown: projectDropDown[] = [];
  formattedToday = '';
  startDate = '';

  constructor(
    private fb: FormBuilder,
    private alert: AlertService,
    private project: ProductService,
    private sprint: SprintService,
    private shared: SharedService,
    public dialogRef: MatDialogRef<SprintFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formSetting();
    this.fetchProjectName();
    this.dateFunction();
  }
  dateFunction() {
     this.minDate = this.formatDate(this.data.projectStartDate);
    this.maxDate = this.formatDate(this.data.projectEndDate);
    console.log('this.data.projectStartDate',this.data.projectStartDate,'this.data.projectEndDate',this.data.projectEndDate)
    console.log('this.minDate',this.minDate,'this.maxDate',this.maxDate);
    
  }
  fetchProjectName() {
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
  formatDate(date: any): string {
  if (!date) return ''; // return empty string or handle as needed

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return ''; // invalid date

  return parsedDate.toISOString().split('T')[0];
}

  formSetting() {
    const id = this.shared.getSelectedProjectId();
    this.sprintForm = this.fb.group({
      projectId: [id || '', Validators.required],
      sprintName: [
        this.data?.sprintName || '',
        [Validators.required, Validators.minLength(3)],
      ],
      goal: [
        this.data?.goal || '',
        [Validators.required, Validators.minLength(5)],
      ],
      startDate: [this.data?.startDate || '', Validators.required],
      endDate: [this.data?.endDate || '', Validators.required],
      status: [this.data?.status || 'Planned', Validators.required],
    });

    if (this.data.mode === 'View') {
      this.sprintForm.disable();
    } else if (this.data.mode !== 'Add') {
      this.sprintForm.get('projectId')?.disable();
    }
  }

  onSubmit() {
    if (this.sprintForm.invalid) return;

    console.log('sprint from paylaod', this.sprintForm.value);

    const sprintPayload = {
      ...this.sprintForm.getRawValue(),
    };
    console.log('sprintPayload', sprintPayload);

    if (this.data.mode === 'Add') {
      const projectName =
        this.dropdown.find((p) => p.id == sprintPayload.projectId)
          ?.projectName || 'Unknown';

      this.sprint.addSprint(sprintPayload).subscribe({
        next: (res) => {
          this.alert.sidePopUp('Sprint added successfully!', 'success');
          this.shared.setSelectedProjectId(sprintPayload.projectId);

          this.dialogRef.close({
            success: true,
            dropdownid: sprintPayload.projectId,
            dropdownName: projectName,
          });
        },
        error: () => {
          this.alert.sidePopUp('Failed to add sprint.', 'error');
        },
      });
    } else if (this.data.mode === 'Edit') {
      const sprintId = this.data.id;
      this.sprint.updateSprint(sprintId, sprintPayload).subscribe({
        next: (res) => {
          this.alert.sidePopUp('Sprint updated successfully!', 'success');
          this.dialogRef.close({ success: true });
        },
        error: () => {
          this.alert.sidePopUp('Failed to update sprint.', 'error');
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}

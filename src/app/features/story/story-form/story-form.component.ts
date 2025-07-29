
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoryService } from '../../../core/services/story.service';
import { AlertService } from '../../../core/services/alert.service';
import { Story } from '../../../core/models/story.model';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-story-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './story-form.component.html',
  styleUrls: ['./story-form.component.scss'],
})
export class StoryFormComponent implements OnInit {
  storyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alert: AlertService,
    private storyService: StoryService,
    private loader:LoaderService,
    public dialogRef: MatDialogRef<StoryFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'Add' | 'Edit' | 'View';
      id: number; 
      storyData?: Story; 
    }
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.storyForm = this.fb.group({
      title: [
        this.data.storyData?.title || '',
        [Validators.required, Validators.minLength(3)],
      ],
      description: [
        this.data.storyData?.description || '',
        [Validators.required, Validators.minLength(5)],
      ],
      status: [
        this.data.storyData?.status || 'Planned',
        Validators.required,
      ],
      sprintId: [this.data.id, Validators.required],
    });

    if (this.data.mode === 'View') {
      this.storyForm.disable();
    }
  }

  onSubmit(): void {
    if (this.storyForm.invalid) {
      this.storyForm.markAllAsTouched();
      return;
    }

    const payload = this.storyForm.getRawValue();

    if (this.data.mode === 'Add') {
      this.loader.show();
      this.storyService.addStory(payload).subscribe({
        next: () => {
          this.alert.sidePopUp('Story added successfully!', 'success');
          this.dialogRef.close({ success: true });
          this.loader.hide();
        },
        error: (err) => {
          this.alert.sidePopUp(err.message,'error');
          this.loader.hide();
        },
      });
    }

    if (this.data.mode === 'Edit' && this.data.storyData?.id) {
      this.loader.show();
      this.storyService.updateStory(this.data.storyData.id.toString(), payload).subscribe({
        next: () => {
          this.alert.sidePopUp('Story updated successfully!', 'success');
          this.dialogRef.close({ success: true });
          this.loader.hide();
        },
        error: (err) => {
          this.loader.hide();
          this.alert.sidePopUp(err.message,'error');
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}

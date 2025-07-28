import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Story } from '../models/story.model';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  constructor(private supabaseService: SupabaseService) {}

  getStory(sprintId: string) {
    return from(
      this.supabaseService.client
        .from('story')
        .select('*')
        .eq('sprintId', sprintId)
        .then(({ data, error }) => {
          if (error) throw error;
          console.log('Stories by Sprint ID:', data);
          return data;
        })
    );
  }

  addStory(payload: Story) {
    return from(
      this.supabaseService.client
        .from('story')
        .insert(payload)
        .then(({ data, error }) => {
          if (error) throw error;
          console.log('Story added:', data);
          return data;
        })
    );
  }

  updateStory(id: string, payload: Story) {
    return from(
      this.supabaseService.client
        .from('story')
        .update(payload)
        .eq('id', id)
        .then(({ data, error }) => {
          if (error) throw error;
          console.log('Story updated:', data);
          return data;
        })
    );
  }

  deleteStory(id: string) {
    return from(
      this.supabaseService.client
        .from('story')
        .delete()
        .eq('id', id)
        .then(({ data, error }) => {
          if (error) throw error;
          console.log('Story deleted:', data);
          return data;
        })
    );
  }
}

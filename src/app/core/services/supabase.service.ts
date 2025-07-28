import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { LoaderService } from '../services/loader.service'; // Adjust path if needed

export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor(private loaderService: LoaderService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

 async profile(user: User) {
  this.loaderService.show();
  try {
    const { data, error } = await this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  } finally {
    this.loaderService.hide();
  }
}


  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    this.loaderService.show();
    return this.supabase.auth
      .signInWithOtp({ email })
      .finally(() => this.loaderService.hide());
  }

  async signOut() {
  this.loaderService.show();
  try {
    await this.supabase.auth.signOut();
  } finally {
    this.loaderService.hide();
  }
}


 async updateProfile(profile: Profile) {
  this.loaderService.show();
  try {
    const update = {
      ...profile,
      updated_at: new Date(),
    };
    const { data, error } = await this.supabase.from('profiles').upsert(update);
    if (error) throw error;
    return data;
  } finally {
    this.loaderService.hide();
  }
}


  downLoadImage(path: string) {
    this.loaderService.show();
    return this.supabase.storage
      .from('avatars')
      .download(path)
      .finally(() => this.loaderService.hide());
  }

  uploadAvatar(filePath: string, file: File) {
    this.loaderService.show();
    return this.supabase.storage
      .from('avatars')
      .upload(filePath, file)
      .finally(() => this.loaderService.hide());
  }

  async getAll<T = any>(table: string): Promise<T[]> {
    this.loaderService.show();
    try {
      const { data, error } = await this.supabase.from(table).select('*');
      if (error) throw error;
      return data as T[];
    } finally {
      this.loaderService.hide();
    }
  }

  async create<T = any>(table: string, record: T): Promise<T> {
    this.loaderService.show();
    try {
      const { data, error } = await this.supabase.from(table).insert([record]).select();
      if (error) throw error;
      return data[0];
    } finally {
      this.loaderService.hide();
    }
  }

  async update<T = any>(
    table: string,
    id: string | number,
    updates: Partial<T>
  ): Promise<T> {
    this.loaderService.show();
    try {
      const { data, error } = await this.supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } finally {
      this.loaderService.hide();
    }
  }

  async delete(table: string, id: string | number): Promise<void> {
    this.loaderService.show();
    try {
      const { error } = await this.supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    } finally {
      this.loaderService.hide();
    }
  }
}

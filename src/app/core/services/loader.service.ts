import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loading.asObservable();
  private requestCount = 0;

  show() {
    console.warn('🔄 Loader SHOW triggered');
    this.requestCount++;
    this.loading.next(true);
  }

  hide() {
    console.warn('🔄 Loader Hide triggered');
    this.requestCount--;
    if (this.requestCount === 0) {
      this.loading.next(false);
    }
  }

  reset() {
    this.requestCount = 0;
    this.loading.next(false);
  }
}

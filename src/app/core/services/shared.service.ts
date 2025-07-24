// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
   private selectedProjectId = new BehaviorSubject<string | null>(null);
  selectedProjectId$ = this.selectedProjectId.asObservable();

  setSelectedProjectId(id: string) {
    this.selectedProjectId.next(id);
  }
   getSelectedProjectId(): string | null {
    return this.selectedProjectId.value;
  }
}

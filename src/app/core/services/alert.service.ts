import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}
  sidePopUp(swal_text: string, status: 'success' | 'error' | 'info' | 'warning' | 'question') {
  Swal.fire({
    icon: status,
    title: status,
    text: swal_text,
    timer: 2000,
    showConfirmButton: false,
    position: 'top-end',
    toast: true,
  });
}
}

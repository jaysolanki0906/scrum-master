import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acess-denied-page',
  imports: [],
  templateUrl: './acess-denied-page.component.html',
  styleUrl: './acess-denied-page.component.scss'
})
export class AcessDeniedPageComponent {
  constructor(private route:Router){}
  dashboardNavigate()
  {
    this.route.navigate(['/dashboard']);
  }
}

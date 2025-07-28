import { Component,OnInit  } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../../core/services/loader.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  imports: [CommonModule,MatProgressSpinnerModule],
  standalone:true,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit{
  isLoading!: Observable<boolean>;
  
  constructor(private loaderService: LoaderService) {}
  ngOnInit()
  {
    this.isLoading = this.loaderService.isLoading$;
    console.warn("hi i am loader");
  }
}

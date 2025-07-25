import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { ProductService } from '../../../core/services/product.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  projectList: Project[] = [];
  isMobileMenuOpen = false;
  dropdownOpen = false;
  role: string | null = null;

  constructor(
    private shared: SharedService,
    private project: ProductService,
    private token: TokenService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.project.getProjectsData().subscribe({
      next: (res) => {
        this.projectList = res;
        const defaultProjectId = this.projectList[0]?.id;

        if (defaultProjectId) {
          this.shared.setSelectedProjectId(defaultProjectId.toString());
        }
      },
    });
    this.sharedService.userRole$.subscribe((role) => {
  this.role = role;
  console.log('HeaderComponent: role updated to', this.role);
});


    console.log("this is role under the header",this.role);
  }

  

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  employeeNaviagation() {
    this.router.navigate(['/employee']);
  }

  passwordChnage() {
    this.router.navigate(['/change-password']);
  }

  storyNaviagation() {
    this.router.navigate(['./scrum-board']);
  }

  myProfile() {
    this.router.navigate(['profile']);
  }

  sprintNavigate() {
    this.router.navigate(['./sprint']);
  }

  dashboardNavigate() {
    this.router.navigate(['dashboard']);
  }

  projectNavigate() {
    this.router.navigate(['/projects']);
  }

  logout() {
    this.token.clearTokens();
    this.router.navigate(['/login']);
  }

  onProjectChange(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.shared.setSelectedProjectId(selectedId);
  }
}


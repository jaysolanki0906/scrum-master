import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashbaord',
  standalone: false,
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  data: any;
  loaded = false;

  constructor(private dashboardService: AuthService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.data = res[0];
        } 
        this.loaded = true;
        console.log("This is data", this.data, "this is response", res);
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
      }
    });
  }

  get taskStatusChart() {
    const { done = 0, inProgress = 0, todo = 0 } = this.data?.summary?.taskStatus || {};
    return {
      labels: ['Done', 'In Progress', 'To-do'],
      datasets: [
        {
          data: [done, inProgress, todo],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          hoverOffset: 6
        }
      ]
    };
  }

  get taskTypeChart() {
    const { tasks = 0, bugs = 0 } = this.data?.charts?.taskType || {};
    return {
      labels: ['Tasks', 'Bugs'],
      datasets: [
        {
          data: [tasks, bugs],
          backgroundColor: ['#3b82f6', '#ef4444'],
          hoverOffset: 6
        }
      ]
    };
  }

  get sprintVelocityChart() {
    const { sprints = [], storyPoints = [] } = this.data?.charts?.sprintVelocity || {};
    return {
      labels: sprints,
      datasets: [
        {
          label: 'Story Points',
          data: storyPoints,
          backgroundColor: 'rgba(59, 130, 246, 0.8)'
        }
      ]
    };
  }

  get hoursBurndownChart() {
    const { sprints = [], estimated = [], logged = [] } = this.data?.charts?.hoursBurndown || {};
    return {
      labels: sprints,
      datasets: [
        {
          label: 'Estimated',
          data: estimated,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Logged',
          data: logged,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }
}
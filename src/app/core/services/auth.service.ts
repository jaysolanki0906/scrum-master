import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DashboardSummary {
  totalProjects: number;
  projects: {
    active: number;
    completed: number;
  };
  totalTasks: number;
  taskStatus: {
    done: number;
    inProgress: number;
    todo: number;
  };
  totalBugs: number;
  hoursLogged: {
    total: number;
    thisSprint: number;
  };
}

export interface DashboardCharts {
  taskType: {
    tasks: number;
    bugs: number;
  };
  hoursBurndown: {
    sprints: string[];
    estimated: number[];
    logged: number[];
  };
}

export interface DashboardResponse {
  summary: DashboardSummary;
  charts: DashboardCharts;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  getDashboardData() {
    const client = this.supabase.client;

    return forkJoin({
      projects: from(client.from('projects').select('*')),
      tasks: from(client.from('task').select('*')),
      bug: from(client.from('task').select('*').eq('type', 'Bug')),
      logging: from(client.from('loggingefforts').select('*')),
      sprints: from(client.from('sprint').select('*'))
    }).pipe(
      map(({ projects, tasks, bug, logging, sprints }): DashboardResponse => {
        const activeProjects = projects.data?.filter(p => p.status === 'active').length || 0;
        const completedProjects = projects.data?.filter(p => p.status === 'completed').length || 0;

        const totalTasks = tasks.data?.length || 0;
        const taskStatus = {
          done: tasks.data?.filter(t => t.status === 'Done').length || 0,
          inProgress: tasks.data?.filter(t => t.status === 'In Progress').length || 0,
          todo: tasks.data?.filter(t => t.status === 'Todo').length || 0
        };

        const totalBugs = bug.data?.length || 0;

        const totalHours = logging.data?.reduce((acc, l) => acc + (l.hours_spent || 0), 0) || 0;

        const latestSprint = sprints.data?.slice(-1)[0]?.id;
        const thisSprintHours = logging.data?.filter(e => e.sprint_id === latestSprint)
          .reduce((acc, l) => acc + (l.hours_spent || 0), 0) || 0;

        const sprintNames = sprints.data?.map(s => s.name) || [];

        const loggedPerSprint = sprintNames.map(name => {
          const sprint = sprints.data?.find(s => s.name === name);
          const sprintId = sprint?.id;
          return logging.data?.filter(l => l.sprint_id === sprintId)
            .reduce((acc, l) => acc + (l.hours_spent || 0), 0) || 0;
        });

        return {
          summary: {
            totalProjects: projects.data?.length || 0,
            projects: {
              active: activeProjects,
              completed: completedProjects
            },
            totalTasks,
            taskStatus,
            totalBugs,
            hoursLogged: {
              total: totalHours,
              thisSprint: thisSprintHours
            }
          },
          charts: {
            taskType: {
              tasks: totalTasks,
              bugs: totalBugs
            },
            hoursBurndown: {
              sprints: sprintNames,
              estimated: [280, 240, 200, 160, 120, 80], // Static for now
              logged: loggedPerSprint
            }
          }
        };
      })
    );
  }
}

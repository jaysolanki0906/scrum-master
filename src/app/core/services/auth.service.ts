import { Injectable } from '@angular/core';

import { TokenService } from './token.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { of } from 'rxjs';

@Injectable()
export class AuthService {

  constructor(private token:TokenService) { }
  // getTokenApi()
  // {
  //   return this.api.get('login/1');
  // }
  getDashboardData() {
    return of([
  {
    "id": "1",
    "summary": {
      "totalProjects": 12,
      "projects": {
        "active": 3,
        "completed": 9
      },
      "totalTasks": 248,
      "taskStatus": {
        "done": 156,
        "inProgress": 67,
        "todo": 25
      },
      "totalBugs": 23,
      "bugs": {
        "critical": 8,
        "normal": 15
      },
      "hoursLogged": {
        "total": 1247,
        "thisSprint": 142
      }
    },
    "charts": {
      "taskType": {
        "tasks": 248,
        "bugs": 23
      },
      "sprintVelocity": {
        "sprints": [
          "Sprint 1",
          "Sprint 2",
          "Sprint 3",
          "Sprint 4",
          "Sprint 5",
          "Sprint 6"
        ],
        "storyPoints": [
          34,
          42,
          38,
          45,
          52,
          48
        ]
      },
      "hoursBurndown": {
        "sprints": [
          "Sprint 1",
          "Sprint 2",
          "Sprint 3",
          "Sprint 4",
          "Sprint 5",
          "Sprint 6"
        ],
        "estimated": [
          280,
          240,
          200,
          160,
          120,
          80
        ],
        "logged": [
          265,
          235,
          195,
          155,
          115,
          85
        ]
      }
    }
  }
]); 
  }
  // refreshToken()
  // {
  //   return of('token');
  // }
}

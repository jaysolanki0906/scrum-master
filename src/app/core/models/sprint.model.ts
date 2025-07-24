export interface Sprint {
  id:number,
  projectId: number,
  sprintName: string,
  goal: string,
  startDate: string, // must be 'YYYY-MM-DD'
  endDate: string,   // must be 'YYYY-MM-DD'
  status: 'Active' | 'Completed' | 'Upcoming'
}

export interface projectDropDown
{
    id:number,
    projectName:string
}

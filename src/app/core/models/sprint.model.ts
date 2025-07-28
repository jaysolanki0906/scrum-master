export interface Sprint {
  id:number,
  projectId: number,
  sprintName: string,
  goal: string,
  startDate: string, 
  endDate: string,
  status: 'Active' | 'Completed' | 'Upcoming'
}

export interface projectDropDown
{
    id:number,
    projectName:string
}

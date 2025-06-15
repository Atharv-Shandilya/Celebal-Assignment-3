export interface EventI {
  id: string;
  event: string;
  start: number;
  end: number;
}

export interface SelectedScheduleTimeI {
  time: string;
  timePeriod: number;
}

export interface IList {
  id: string;
  title: string;
  tasks: ITask[];
}

export interface ITask {
  id: string;
  task: string;
  isCompleted: boolean;
  priority: string;
}

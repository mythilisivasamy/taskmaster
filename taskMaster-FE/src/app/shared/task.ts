export interface Task {
  _id?: string;
  title: string | null;
  description: string | null;
  dueDate: string | null;
  status: string | null;
}

export interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

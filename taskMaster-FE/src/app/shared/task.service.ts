import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Task, User } from './task';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks$!: Observable<Task[]>;
  private uri = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {
    this.tasks$ = this.getTasks();
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse instanceof ErrorEvent) {
      console.error(`client error,${errorResponse}`);
    } else {
      console.error(`server side error`);
    }
    return throwError(() => 'there is a error with service');
  }

  getTasks(): Observable<any> {
    return this.http.get(`${this.uri}/task`).pipe(
      tap((tasks) => this.tasks$ != of(tasks)),
      catchError(this.handleError)
    );
  }

  addTask(task: Task): Observable<unknown> {
    return this.http.post(`${this.uri}/task`, task);
  }

  getTask(id: string) {
    return this.tasks$.pipe(
      map((tasks) => tasks.find((task) => task._id === id)!)
    );
  }

  editTask(task: Task): Observable<unknown> {
    return this.http
      .put<Task>(`${this.uri}/task/${task._id}`, task!, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteTask(task: Task): Observable<unknown> {
    return this.http
      .delete<Task>(`${this.uri}/task/${task._id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  signup(user: User): Observable<unknown> {
    return this.http.post(`${this.uri}/user/signup`, user);
  }
  login(user: User): Observable<unknown> {
    return this.http.post(`${this.uri}/user/login`, user);
  }
}

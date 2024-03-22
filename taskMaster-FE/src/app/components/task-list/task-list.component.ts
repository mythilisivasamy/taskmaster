import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Task } from '../../shared/task';
import { TaskService } from '../../shared/task.service';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  tasks$!: Observable<Task[]>;
  editTask$!: Task;
  subscription!: Subscription;
  faEdit = faEdit;
  faTrash = faTrash;
  page: number = 1;
  perPage: number = 2;
  offset!: number;
  noOfPages!: number[];
  pagestring: string = '';
  constructor(private ts: TaskService) {}

  ngOnInit(): void {
    this.subscription = this.ts.getTasks().subscribe(
      (tasks: Task[]) => {
        let pages = Math.round(tasks.length / this.perPage);
        this.noOfPages = Array.from(
          { length: pages },
          (value, index) => index + 1
        );
        this.tasks$ = of(tasks);
        this.ts.tasks$ = of(tasks);
      },
      (error: any) => {
        //error() callback
        console.error('Request failed with ' + error);
      }
    );
  }

  onDelete(_task: Task) {
    this.subscription = this.ts.deleteTask(_task).subscribe();
    window.location.reload();
  }

  onEdit(_task: Task) {
    this.editTask$ = _task;
  }

  onEdited(_task: Task) {
    this.ts.editTask(_task).subscribe(() => {
      window.location.reload();
    });
    this.closebtn.nativeElement.click();
  }
  changePage() {}
  ngOnDestory() {
    this.subscription.unsubscribe();
  }
}

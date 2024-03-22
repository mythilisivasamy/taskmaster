import { Component } from '@angular/core';
import { TaskService } from '../../shared/task.service';
import { Task } from '../../shared/task';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { stringValidator } from '../../shared/customValidator';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  constructor(
    private ts: TaskService,
    private builder: FormBuilder,
    private router: Router
  ) {}
  task!: Task;
  taskForm: FormGroup = this.builder.group({
    taskTitle: ['', [Validators.required, stringValidator(/^[a-zA-Z\s]+$/)]],
    taskDescription: [
      '',
      [Validators.required, stringValidator(/^[a-zA-Z\s]+$/)],
    ],
    taskDueDate: ['', Validators.required],
    taskStatus: ['', Validators.required],
  });

  get taskTitle() {
    return this.taskForm.get('taskTitle');
  }
  get taskDescription() {
    return this.taskForm.get('taskDescription');
  }
  get taskDueDate() {
    return this.taskForm.get('taskDueDate');
  }
  get taskStatus() {
    return this.taskForm.get('taskStatus');
  }

  addTask() {
    this.task = {
      title: this.taskTitle!.value,
      description: this.taskDescription!.value,
      dueDate: this.taskDueDate!.value,
      status: this.taskStatus!.value,
    };

    this.ts.addTask(this.task).subscribe(() => {
      this.router.navigate(['../taskList']);
    });
  }
}

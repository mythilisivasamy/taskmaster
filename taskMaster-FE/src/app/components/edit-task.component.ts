import {
  Component,
  Input,
  Output,
  OnChanges,
  EventEmitter,
} from '@angular/core';
import { Task } from '../shared/task';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { stringValidator } from '../shared/customValidator';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css',
})
export class EditTaskComponent implements OnChanges {
  constructor(private builder: FormBuilder) {}
  @Input() editTask$!: Task;
  @Output() edited = new EventEmitter<Task>();
  task!: Task;
  editForm: FormGroup = this.builder.group({
    taskTitle: [null, [Validators.required, stringValidator(/^[a-zA-Z\s]+$/)]],
    taskDescription: [
      null,
      [Validators.required, stringValidator(/^[a-zA-Z\s]+$/)],
    ],
    taskDueDate: [null, Validators.required],
    taskStatus: [null, Validators.required],
  });

  ngOnChanges(): void {
    this.editForm.setValue({
      taskTitle: this.editTask$!.title,
      taskDescription: this.editTask$!.description,
      taskDueDate: this.editTask$!.dueDate,
      taskStatus: this.editTask$!.status,
    });
  }

  get taskTitle() {
    return this.editForm.get('taskTitle');
  }
  get taskDescription() {
    return this.editForm.get('taskDescription');
  }
  get taskDueDate() {
    return this.editForm.get('taskDueDate');
  }
  get taskStatus() {
    return this.editForm.get('taskStatus');
  }

  editTask() {
    this.task = {
      _id: this.editTask$._id,
      title: this.taskTitle!.value,
      description: this.taskDescription!.value,
      dueDate: this.taskDueDate!.value,
      status: this.taskStatus!.value,
    };
    this.edited.emit(this.task);
  }
}

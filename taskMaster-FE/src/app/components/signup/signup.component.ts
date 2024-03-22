import { Component } from '@angular/core';
import { User } from '../../shared/task';
import { Router } from '@angular/router';
import { TaskService } from '../../shared/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { stringValidator, emailValidator } from '../../shared/customValidator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(
    private ts: TaskService,
    private builder: FormBuilder,
    private router: Router
  ) {}

  user!: User;
  isPending!: Boolean;
  msg: string = '';
  userForm: FormGroup = this.builder.group({
    firstName: ['', [Validators.required, stringValidator(/^[a-zA-Z\s]+$/)]],
    lastName: ['', [Validators.required, stringValidator(/^[a-zA-Z\s]+$/)]],
    email: [
      '',
      [
        Validators.required,
        emailValidator(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/),
      ],
    ],
    password: ['', Validators.required],
  });

  get firstName() {
    return this.userForm.get('firstName');
  }
  get lastName() {
    return this.userForm.get('lastName');
  }
  get email() {
    return this.userForm.get('email');
  }
  get password() {
    return this.userForm.get('password');
  }

  signup() {
    this.isPending = true;
    this.msg = '';
    this.user = {
      firstName: this.firstName?.value,
      lastName: this.lastName?.value,
      email: this.email?.value,
      password: this.password?.value,
    };

    this.ts.signup(this.user).subscribe((response: any) => {
      if (response.statusCode === '203') {
        this.isPending = false;
        this.msg = 'Email already exist';
      }
      if (response.statusCode === '201') {
        this.isPending = false;
        this.router.navigate(['/login']);
      }
    });
  }
}

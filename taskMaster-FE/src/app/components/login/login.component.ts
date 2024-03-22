import { Component } from '@angular/core';
import { TaskService } from '../../shared/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/task';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private ts: TaskService,
    private builder: FormBuilder,
    private router: Router
  ) {}
  isPending!: Boolean;
  msg: string = '';
  loginForm: FormGroup = this.builder.group({
    email: ['', [Validators.required]],
    password: ['', Validators.required],
  });

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  login() {
    this.isPending = true;
    this.ts
      .login({ email: this.email?.value, password: this.password?.value })
      .subscribe((userInfo: any) => {
        if (userInfo.statusCode === '200') {
          this.isPending = false;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          this.router.navigate(['/taskList']);
        }
        if (userInfo.statusCode === '202') {
          this.isPending = false;
          this.msg = 'Invalid password';
        }
        if (userInfo.statusCode === '201') {
          this.isPending = false;
          this.msg = 'Invalid Email';
        }
      });
  }
}

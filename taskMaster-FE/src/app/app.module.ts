import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { SignupComponent } from './components/signup/signup.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditTaskComponent } from './components/edit-task.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    SignupComponent,
    AddTaskComponent,
    TaskListComponent,
    EditTaskComponent
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

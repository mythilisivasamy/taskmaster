import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  constructor(private router: Router) {}
  userInfo$!: any;
  ngOnInit(): void {
    this.userInfo$ = JSON.parse(localStorage.getItem('userInfo')!);
    console.log(this.userInfo$.userInfo);
  }
  logout() {
    localStorage.removeItem('userInfo');
    this.router.navigate(['/login']);
  }
 
}

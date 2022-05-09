import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public currentIndex:number = 1;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
  }

  public setCurrentIndex(index:number) {
    this.currentIndex = index;
  }

  public logout() {
    this.authService.SignOut();
  }
}

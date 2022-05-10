import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public currentIndex: number;

  constructor(public authService: AuthService) {
    this.currentIndex = 0;
  }

  ngOnInit(): void {
  }

  public setCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  public logout() {
    this.authService.SignOut();
  }
}

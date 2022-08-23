import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public currentIndex: number = 0;

  constructor(public authService: AuthService, private location: Location, private route: ActivatedRoute, private router: Router) {
    if (router.url.includes('active')) this.currentIndex = 0;
    else if (router.url.includes('reports')) this.currentIndex = 1;
    else if (router.url.includes('banned')) this.currentIndex = 2;
  }

  ngOnInit(): void {
    this.location.subscribe(event => {
      if (event.url?.includes('active')) {
        this.currentIndex = 0;
        this.router.navigate(['active'], { relativeTo: this.route })
      }
      else if (event.url?.includes('reports')) this.currentIndex = 1;
      else if (event.url?.includes('banned')) this.currentIndex = 2;
    });
  }


  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  showActiveUsers() {
    if (!this.router.url.includes('active/profile')) {
      this.currentIndex = 0;
      this.router.navigate(['active'], { relativeTo: this.route })
    }
  }

  showReports() {
    if (!this.router.url.includes('reports/profile')) {
      this.currentIndex = 1;
      this.router.navigate(['reports'], { relativeTo: this.route })
    }
  }

  showBannedUsers() {
    if (!this.router.url.includes('banned/profile')) {
      this.currentIndex = 2;
      this.router.navigate(['banned'], { relativeTo: this.route })
    }
  }
}

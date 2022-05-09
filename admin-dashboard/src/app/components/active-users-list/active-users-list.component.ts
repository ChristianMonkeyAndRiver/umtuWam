import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-active-users-list',
  templateUrl: './active-users-list.component.html',
  styleUrls: ['./active-users-list.component.css']
})
export class ActiveUsersListComponent implements OnInit {
  
  activeUsers: any;
  user: any;
  showDetails: boolean;
  public searchText = '';

  
  constructor(private userService: UsersService) { 
    this.showDetails = false;
  }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  setShowDetails(showDetails: boolean, user: any): void {
    this.user = user;
    this.showDetails = showDetails;
  }

  retrieveUsers(): void {
    this.userService.getAll(0).snapshotChanges().pipe(
      map(changes => {
        return changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        );
      }
        
      )
    ).subscribe(data => {
      this.activeUsers = data;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { map } from 'rxjs/operators';
import { ReportsListComponent } from '../reports-list/reports-list.component';

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
  private firestoreIndex: number;

  
  constructor(private userService: UsersService, public reportComp: ReportsListComponent) { 
    this.showDetails = false;
    this.firestoreIndex = 0;
  }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  setShowDetails(showDetails: boolean, user: any): void {
    this.user = user;
    this.showDetails = showDetails;
  }

  retrieveUsers(): void {
    this.userService.getAll(this.firestoreIndex).snapshotChanges().pipe(
      map(changes => {
        // this.firestoreIndex = this.firestoreIndex + changes.length;
        return changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        );
      }
        
      )
    ).subscribe(data => {
      this.activeUsers = data;
    });
  }

  getPrevBatchedUsers(): void {
    if (this.firestoreIndex <= 30) return;

    if ((this.firestoreIndex - 30) < 30 ) this.firestoreIndex = 30;

    this.firestoreIndex = this.firestoreIndex - 30;
  }
}

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
  public searchText = '';

  
  constructor(private userService: UsersService, public reportComp: ReportsListComponent) { }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  retrieveUsers(): void {
    this.userService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.activeUsers = data;
    });
  }
}

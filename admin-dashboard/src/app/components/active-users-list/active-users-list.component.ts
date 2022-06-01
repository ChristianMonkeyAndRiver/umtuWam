import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ViewProfileServiceService } from 'src/app/services/view-profile-service.service';

@Component({
  selector: 'app-active-users-list',
  templateUrl: './active-users-list.component.html',
  styleUrls: ['./active-users-list.component.css']
})
export class ActiveUsersListComponent implements OnInit {

  user: any;

  showDetails: boolean;

  searchText: string = '';

  //Data object for listing items
  activeUsers: any[] = [];
  filteredActiveUsers: any[] = [];

  //Save first document in snapshot of items received
  firstInResponse: any = [];

  //Save last document in snapshot of items received
  lastInResponse: any = [];

  //Keep the array of first document of previous pages
  prev_start_at: any = [];

  //Maintain the count of clicks on Next Prev button
  pagination_clicked_count = 0;

  //Disable next and prev buttons
  disable_next: boolean = false;
  disable_prev: boolean = false;

  constructor(private userService: UsersService, private location: Location, private userData: ViewProfileServiceService, private route: ActivatedRoute, private router: Router) {
    if (this.router.url.includes('active/profile')) {
      this.showDetails = true;
      this.router.navigate(['profile'], { relativeTo: this.route })
    } else {
      this.showDetails = false;
    }
  }

  ngOnInit(): void {
    this.loadUsers();
    console.log('Loading users');
    this.location.subscribe(event => {
      if (event.url?.includes('active/profile')) {
        this.showDetails = true;
        this.router.navigate(['profile'], { relativeTo: this.route })
      }
    });

  }

  // search(val): void {
  //   this.timer= 
  // }

  showProfile(showDetails: boolean, user: any): void {
    this.user = user;
    this.showDetails = showDetails;
    this.userData.setUser(user);
    this.router.navigate(['profile'], { relativeTo: this.route })
  }

  loadUsers(): void {
    this.userService.loadUsers()
      .snapshotChanges()
      .subscribe(users => {
        if (!users.length) {
          console.log("No Data Available");
          return;
        }
        this.firstInResponse = users[0].payload.doc;
        this.lastInResponse = users[users.length - 1].payload.doc;

        this.activeUsers = [];
        for (let item of users) {
          this.activeUsers.push({ id: item.payload.doc.id, ...item.payload.doc.data() });
        }
        this.filteredActiveUsers = this.activeUsers;

        //Initialize values
        this.prev_start_at = [];
        this.pagination_clicked_count = 0;
        this.disable_next = false;
        this.disable_prev = false;

        //Push first item to use for Previous action
        this.push_prev_startAt(this.firstInResponse);
      });
  }

  //Show previous set 
  prevPage() {
    this.disable_prev = true;
    this.userService.loadPrev(this.get_prev_startAt(), this.firstInResponse)
      .get()
      .subscribe(users => {
        this.firstInResponse = users.docs[0];
        this.lastInResponse = users.docs[users.docs.length - 1];

        this.activeUsers = [];
        for (let item of users.docs) {
          this.activeUsers.push({ id: item.id, ...item.data() });
        }
        this.filteredActiveUsers = this.activeUsers;


        //Maintaing page no.
        this.pagination_clicked_count--;

        //Pop not required value in array
        this.pop_prev_startAt(this.firstInResponse);

        //Enable buttons again
        this.disable_prev = false;
        this.disable_next = false;
      }, error => {
        this.disable_prev = false;
      });
  }

  nextPage() {
    this.disable_next = true;
    this.userService.loadNext(this.lastInResponse)
      .get()
      .subscribe(users => {

        if (!users.docs.length) {
          this.disable_next = true;
          return;
        }

        this.firstInResponse = users.docs[0];
        this.lastInResponse = users.docs[users.docs.length - 1];

        this.activeUsers = [];
        for (let item of users.docs) {
          this.activeUsers.push({ id: item.id, ...item.data() });
        }
        this.filteredActiveUsers = this.activeUsers;


        this.pagination_clicked_count++;

        this.push_prev_startAt(this.firstInResponse);

        this.disable_next = false;
      }, error => {
        this.disable_next = false;
      });
  }

  //Add document
  push_prev_startAt(prev_first_doc: any) {
    this.prev_start_at.push(prev_first_doc);
  }

  //Remove not required document 
  pop_prev_startAt(prev_first_doc: any) {
    this.prev_start_at.forEach((element: any) => {
      if (prev_first_doc.data().id == element.data().id) {
        element = null;
      }
    });
  }

  //Return the Doc rem where previous page will startAt
  get_prev_startAt() {
    if (this.prev_start_at.length > (this.pagination_clicked_count + 1))
      this.prev_start_at.splice(this.prev_start_at.length - 2, this.prev_start_at.length - 1);
    return this.prev_start_at[this.pagination_clicked_count - 1];
  }
}

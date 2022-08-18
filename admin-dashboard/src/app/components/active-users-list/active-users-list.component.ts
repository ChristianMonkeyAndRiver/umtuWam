import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { ViewProfileServiceService } from 'src/app/services/view-profile-service.service';
import { debounce, debounceTime, distinctUntilChanged } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

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

  isLoading:boolean;

  public searchController = new FormControl('');

  constructor(
    private userService: UsersService, 
    private location: Location, 
    private userData: ViewProfileServiceService, 
    private route: ActivatedRoute, 
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.isLoading=true;
    if (this.router.url.includes('active/profile')) {
      this.showDetails = true;
      this.showLocalProfile(); 
    } else {
      this.showDetails = false;
      this.loadUsers();
    }
  }

  ngOnInit(): void {
    this.location.subscribe(event => {
      if (event.url?.includes('active/profile')) {
        this.showLocalProfile();
      }
      else if (event.pop) { 
        this.showDetails = false;
        this.loadUsers();
      }
    });
  }

  showLocalProfile(): void {
    this.showDetails =  true;
    var retrievedObject = localStorage.getItem('RECENT_USER');
    this.userData.setUser(JSON.parse(retrievedObject ?? ''));
    this.router.navigate(['profile'], { relativeTo: this.route })
  } 

  showProfile(showDetails: boolean, user: any): void {
    this.user = user;
    this.showDetails = showDetails;
    this.userData.setUser(user);
    localStorage.setItem('RECENT_USER', JSON.stringify(this.user));
    this.router.navigate(['profile'], { relativeTo: this.route })
  }

  hideLoader(){
    this.isLoading=false;
  }

  loadUsers(): void {
    this.loaderService.showLoader();
    this.searchController.valueChanges
      .pipe(debounceTime(2000))
      .pipe(distinctUntilChanged())
      .subscribe(text => {
        text = text.charAt(0).toUpperCase() + text.slice(1);
        var strSearch = text;
        var strlength = strSearch.length;
        var strFrontCode = strSearch.slice(0, strlength-1);
        var strEndCode = strSearch.slice(strlength-1, strSearch.length);

        var startcode = strSearch;
        var endcode= strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
        
        
        this.userService.searchUsers(startcode, endcode)
        .subscribe(response => {

          if (!response.docs.length) {
            console.log("No More Data Available");
            this.disable_next = true;
            return;
          }
  
          this.firstInResponse = response.docs[0];
          this.lastInResponse = response.docs[response.docs.length - 1];
  
          this.activeUsers = [];
          for (let item of response.docs) {
            const data = JSON.parse(JSON.stringify(item.data()));
            this.activeUsers.push({ 
              id: item.id,
              ...data,
            });
          }
          this.filteredActiveUsers = this.activeUsers;
  
  
          this.pagination_clicked_count++;
  
          this.push_prev_startAt(this.firstInResponse);
  
          if (response.docs.length < 5) {
            // disable next button if data fetched is less than 5 - means no more data left to load
            // because limit ti get data is set to 5
            this.disable_next = true;
          } else {
              this.disable_next = false;
          }
        this.disable_prev = false;
        this.loaderService.hideLoader();
        }, error => {
          this.disable_next = false;
          this.loaderService.hideLoader();
          console.log(error);
        });
      })
  }
  
  //Show previous set 
  prevPage() {
    this.loaderService.showLoader();
    this.disable_prev = true;
    this.userService.loadPrev(this.get_prev_startAt(), this.firstInResponse)
      .subscribe(response => {
        this.firstInResponse = response.docs[0];
        this.lastInResponse = response.docs[response.docs.length - 1];

        this.activeUsers = [];
        for (let item of response.docs) {
          const data = JSON.parse(JSON.stringify(item.data()));
          this.activeUsers.push({ 
            id: item.id,
            ...data,
          });
        }
        this.filteredActiveUsers = this.activeUsers;


        //Maintaining page no.
        this.pagination_clicked_count--;

        //Pop not required value in array
        this.pop_prev_startAt(this.firstInResponse);

        // enable buttons again
        if (this.pagination_clicked_count == 0) {
          this.disable_prev = true;
        } else {
          this.disable_prev = false;
        }
        this.disable_next = false;
        this.loaderService.hideLoader();
      }, error => {
        this.disable_prev = false;
        this.loaderService.hideLoader();
        console.log(error);
      });
  }

  nextPage() {
    this.loaderService.showLoader();
    this.disable_next = true;
    this.userService.loadNext(this.lastInResponse)
      .subscribe(response => {

        if (!response.docs.length) {
          console.log("No More Data Available");
          this.disable_next = true;
          return;
        }

        this.firstInResponse = response.docs[0];
        this.lastInResponse = response.docs[response.docs.length - 1];

        this.activeUsers = [];
        for (let item of response.docs) {
          const data = JSON.parse(JSON.stringify(item.data()));
          this.activeUsers.push({ 
            id: item.id,
            ...data,
          });
        }
        this.filteredActiveUsers = this.activeUsers;


        this.pagination_clicked_count++;

        this.push_prev_startAt(this.firstInResponse);

        if (response.docs.length < 5) {
          // disable next button if data fetched is less than 5 - means no more data left to load
          // because limit ti get data is set to 5
          this.disable_next = true;
        } else {
            this.disable_next = false;
        }
        this.disable_prev = false;
        this.loaderService.hideLoader();
      }, error => {
        this.disable_next = false;
        this.loaderService.hideLoader();
        console.log(error);
      });
  }

  // add a document
  push_prev_startAt(prev_first_doc: any) {
    this.prev_start_at.push(prev_first_doc);
  }

  // remove non required document 
  pop_prev_startAt(prev_first_doc: any) {
    this.prev_start_at.forEach((element: any) => {
      if (prev_first_doc.data().id == element.data().id) {
        element = null;
      }
    });
  }

  // return the Doc rem where previous page will startAt
  get_prev_startAt() {
    if (this.prev_start_at.length > (this.pagination_clicked_count + 1)) {
      this.prev_start_at.splice(this.prev_start_at.length - 2, this.prev_start_at.length - 1);
    }
    return this.prev_start_at[this.pagination_clicked_count - 1];
  }

  setShowDetails(showDetails: boolean, user: any): void {
    this.user = user;
    this.showDetails = showDetails;
  }
}


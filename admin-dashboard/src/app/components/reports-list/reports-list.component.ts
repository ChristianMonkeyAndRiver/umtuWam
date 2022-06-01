import { Component, OnInit, Inject } from '@angular/core';
import { Location } from "@angular/common";
import { ReportsService } from '../../services/reports.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ViewProfileServiceService } from 'src/app/services/view-profile-service.service';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent implements OnInit {
  searchText: string = '';
  user: any;
  showDetails: boolean;
  //Data object for listing items
  reports: any[] = [];
  filteredReports: any[] = [];

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


  constructor(
    private reportsService: ReportsService, private userData: ViewProfileServiceService, private location: Location, private route: ActivatedRoute, private router: Router
  ) {
    if (this.router.url.includes('reports/profile')) {
      this.showDetails = true;
      this.router.navigate(['profile'], { relativeTo: this.route })
    } else {
      this.showDetails = false;
    }
  }

  ngOnInit(): void {
    this.loadReports();
    this.location.subscribe(event => {
      if (event.url?.includes('reports/profile')) {
        this.showDetails = true;
        this.router.navigate(['profile'], { relativeTo: this.route })
      }
    });
  }
  showProfile(showDetails: boolean, user: any): void {
    this.user = user;
    this.showDetails = showDetails;
    this.userData.setUser(user);
    this.router.navigate(['profile'], { relativeTo: this.route })
  }

  search(): void {
    this.filteredReports = this.reports.filter(user =>
      user.name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1
    );
  }

  loadReports(): void {
    this.reportsService.loadReports()
      .snapshotChanges()
      .subscribe(users => {
        if (!users.length) {
          console.log("No Data Available");
          return;
        }
        this.firstInResponse = users[0].payload.doc;
        this.lastInResponse = users[users.length - 1].payload.doc;

        this.reports = [];
        for (let item of users) {
          this.reports.push({ docId: item.payload.doc.id, id: item.payload.doc.data().transgressorId, ...item.payload.doc.data() });
        }
        this.filteredReports = this.reports;

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
    this.reportsService.loadPrev(this.get_prev_startAt(), this.firstInResponse)
      .get()
      .subscribe(users => {
        this.firstInResponse = users.docs[0];
        this.lastInResponse = users.docs[users.docs.length - 1];

        this.reports = [];
        for (let item of users.docs) {
          this.reports.push({ id: item.id, ...item.data() });
        }
        this.filteredReports = this.reports;


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
    this.reportsService.loadNext(this.lastInResponse)
      .get()
      .subscribe(users => {

        if (!users.docs.length) {
          this.disable_next = true;
          return;
        }

        this.firstInResponse = users.docs[0];
        this.lastInResponse = users.docs[users.docs.length - 1];

        this.reports = [];
        for (let item of users.docs) {
          this.reports.push({ id: item.id, ...item.data() });
        }
        this.filteredReports = this.reports;


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

  setShowDetails(showDetails: boolean, user: any): void {
    this.user = user;
    this.showDetails = showDetails;
  }

}
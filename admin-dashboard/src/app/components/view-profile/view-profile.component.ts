import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  @Input() user: any;

  constructor() { }

  ngOnInit(): void {
  }

  showDelete() {

  }
}

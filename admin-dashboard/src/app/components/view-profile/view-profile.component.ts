import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewProfileServiceService } from 'src/app/services/view-profile-service.service';
import { ModalPopupService } from 'src/app/services/modal-popup.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  user: any;
  isLoading:boolean;

  constructor(
    public dialog: MatDialog, private loaderService: LoaderService,
    private userData: ViewProfileServiceService, private modalPopupService: ModalPopupService,
  ) {
    this.isLoading=true;
  }

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.userData.currentUser.subscribe((userObj: any) => {
      this.user = userObj;
      this.loaderService.hideLoader();
    })
  }

  hideLoader(){
    this.isLoading=false;
  }

  showDelete(image: string) {
    this.modalPopupService.deleteModal(this.user, image);
  }

  showBioDialog() {
    this.modalPopupService.showBioModal(this.user);
  }

  openDialog() {
    if (this.user.isBanned) this.modalPopupService.unBanModal(this.user);
    else this.modalPopupService.banModal(this.user);
  }
}

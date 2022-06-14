import { Component, Input, OnInit, Inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ViewProfileServiceService } from 'src/app/services/view-profile-service.service';
import { ModalPopupService } from 'src/app/services/modal-popup.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  user: any;

  constructor(
    public dialog: MatDialog, private route: ActivatedRoute, private router: Router,
    private userData: ViewProfileServiceService, private modalPopupService: ModalPopupService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.user = params['user'];
    });
  }

  ngOnInit(): void {
    this.userData.currentUser.subscribe((userObj: any) => this.user = userObj)
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

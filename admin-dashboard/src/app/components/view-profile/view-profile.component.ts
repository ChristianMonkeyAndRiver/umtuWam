import { Component, Input, OnInit, Inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  user: any;
}

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  @Input() user: any;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void { }

  showDelete() {

  }

  openDialog() {
    this.dialog.open(ViewProfileBanDialog, {
      data: { user: this.user }
    });
  }
}

@Component({
  selector: 'view-profile-ban-dialog',
  templateUrl: 'view-profile-ban-dialog.html',
})
export class ViewProfileBanDialog {
  constructor(
    public dialogRef: MatDialogRef<ViewProfileBanDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UsersService
  ) { }

  public updateTrue(user: any) {
    this.userService.update(user.user.id, { isBanned: true });
  }

  public updateFalse(user: any) {
    this.userService.update(user.user.id, { isBanned: false });
  }
}
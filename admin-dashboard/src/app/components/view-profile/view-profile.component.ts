import { Component, Input, OnInit, Inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  user: any;
  imageLink: string;
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

  showDelete(image: string) {
    this.dialog.open(ViewProfileDeleteImageDialog, {
      data: { user: this.user, imageLink: image }
    });
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

  public deleteImage(user: any, image: string) {
    const images = user.user.images;
    var filteredArray = images.filter((item: string) => !image.includes(item))
    console.log(filteredArray);

  }
}

@Component({
  selector: 'view-profile-delete-image-dialog',
  templateUrl: 'view-profile-delete-image-dialog.html',
})
export class ViewProfileDeleteImageDialog {
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

  public async deleteImage(user: any, image: string) {
    const images = user.user.images;
    var filteredArray = images.filter((item: string) => !image.includes(item))

    this.userService.update(user.user.id, { images: filteredArray });
    user.user.images = filteredArray;
  }
}


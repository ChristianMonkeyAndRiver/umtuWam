import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../components/modal-popup/modal-interface';
import { ModalPopupComponent } from '../components/modal-popup/modal-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ModalPopupService {

  constructor(public dialog: MatDialog) { }

  deleteModal(user: any, imageLink: string) {
    let dataObject: DialogData = {
      user: user,
      isShowBio: false,
      isDelete: true,
      imageLink: imageLink,
      isBanned: user.isBanned,
    }

    this.dialog.open(ModalPopupComponent, {
      data: dataObject,
    })
  }

  banModal(user: any) {
    let dataObject: DialogData = {
      user: user,
      imageLink: '',
      isShowBio: false,
      isDelete: false,
      isBanned: false,
    }

    this.dialog.open(ModalPopupComponent, {
      data: dataObject,
    })
  }

  unBanModal(user: any) {
    let dataObject: DialogData = {
      user: user,
      imageLink: '',
      isShowBio: false,
      isDelete: false,
      isBanned: true,
    }

    this.dialog.open(ModalPopupComponent, {
      data: dataObject,
    })
  }
  showBioModal(user: any) {
    let dataObject: DialogData = {
      user: user,
      imageLink: '',
      isShowBio: true,
      isDelete: false,
      isBanned: false,
    }

    this.dialog.open(ModalPopupComponent, {
      data: dataObject,
    })
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { DialogData } from './modal-interface';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css']
})
export class ModalPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private userService: UsersService) { }
  ngOnInit(): void { }

  // public updateTrue(user: any) {
  //   this.userService.update(user.id, { isBanned: true });
  // }

  // public updateFalse(user: any) {
  //   this.userService.update(user.id, { isBanned: false });
  // }

  // public async deleteImage(user: any, image: string) {
  //   const images = user.images;
  //   const filteredArray = images.filter((item: string) => !image.includes(item))

  //   this.userService.update(user.id, { images: filteredArray });
  //   user.images = filteredArray;
  // }
}

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../components/loader/loader.component';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  dialogRef: any;
  constructor(public dialog: MatDialog) {}

    showLoader() {
    this.dialogRef =  this.dialog.open(LoaderComponent, {});
    }

    hideLoader() {
      this.dialogRef?.close();
    }

}

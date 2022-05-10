import { Component, OnInit, Inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

export interface DialogData {
  id: string;
}

@Component({
  selector: 'app-banned-accounts-list',
  templateUrl: './banned-accounts-list.component.html',
  styleUrls: ['./banned-accounts-list.component.css']
})
export class BannedAccountsListComponent implements OnInit {

  bannedUsers: any;
  user: any;
  showDetails: boolean;
  private firestoreIndex: number;
  public searchText = '';

  constructor(
    public dialog: MatDialog,
    private userService: UsersService
  ) {
    this.firestoreIndex = 0;
    this.showDetails = false;
  }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  retrieveUsers(): void {
    this.userService.getAllBanned(this.firestoreIndex).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.bannedUsers = data;
    });
  }

  setShowDetails(showDetails: boolean, user: any): void {
    this.user = user;
    this.showDetails = showDetails;
  }

  openDialog(id: string) {
    this.dialog.open(BannedAccountsDialog, {
      data: { id: id }
    });
  }
}

@Component({
  selector: 'banned-accounts-dialog',
  templateUrl: 'banned-accounts-dialog.html',
})
export class BannedAccountsDialog {
  constructor(
    public dialogRef: MatDialogRef<BannedAccountsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UsersService
  ) { }

  public update(id: string) {
    this.userService.update(id, { isBanned: false });
  }
}
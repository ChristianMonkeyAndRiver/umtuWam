import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ReportsService } from '../../services/reports.service';
import { map } from 'rxjs/operators';

export interface DialogData {
  id: string;
}


@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent implements OnInit {
  reports: any;
  public searchText = '';
  constructor(
    public dialog: MatDialog,
    private reportsService: ReportsService,
  ) { }

  ngOnInit(): void {
    this.retrieveReports();
  }

  retrieveReports(): void {
    this.reportsService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.reports = data;
    });
  }

  openDialog(id: string) {
    this.dialog.open(ReportsListDialog, {
      data: {id: id}
    });
  }

}

@Component({
  selector: 'reports-list-dialog',
  templateUrl: 'reports-list-dialog.html',
})
export class ReportsListDialog {
  constructor(
    public dialogRef: MatDialogRef<ReportsListDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private reportsService: ReportsService
  ) {}

  public update(id: string) {
    this.reportsService.update(id, {isBanned: true});
  }
}
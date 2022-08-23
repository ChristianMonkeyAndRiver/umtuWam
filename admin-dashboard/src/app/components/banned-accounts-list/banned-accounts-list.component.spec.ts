import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannedAccountsListComponent } from './banned-accounts-list.component';

describe('BannedAccountsListComponent', () => {
  let component: BannedAccountsListComponent;
  let fixture: ComponentFixture<BannedAccountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannedAccountsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannedAccountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

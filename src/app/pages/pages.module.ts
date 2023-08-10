import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { BillComponent } from './bills/bill.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    BillComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    DashboardComponent,
    PagesComponent,
    BillComponent
  ]
})
export class PagesModule { }

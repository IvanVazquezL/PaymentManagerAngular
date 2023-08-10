import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BillComponent } from './bills/bill.component';

const childRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
    { path: 'bill/:id', component: BillComponent, data: { title: 'Bill' }}
]

@NgModule({
    imports: [ RouterModule.forChild(childRoutes) ],
    exports: [ RouterModule ]
  })
  export class ChildRoutesModule { }


import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BillComponent } from './bills/bill.component';

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
    { path: 'dashboard/bill/:id', component: BillComponent, data: { title: 'Bill' }}
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}
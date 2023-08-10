import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})

export class BillService {

    constructor(
        private http: HttpClient
    ) { }

    get token(): string {
        return localStorage.getItem('token') || '';
      }
    
    get headers() {
        return {
            headers: {
            'x-token': this.token
            }
        }
    }

    getAllBillsByUserId(userId: String) {
        return this.http.get(`${ base_url }/bills/user/${userId}`, this.headers)
            .pipe(
                map((resp: any) => {
                    console.log(userId);
                    console.log(JSON.stringify(resp, null, 2))
                    return resp.bills})
            )
    }

    getBillById(billId: String) {
        return this.http.get(`${ base_url }/bills/${billId}`, this.headers)
            .pipe(
                map((resp: any) => resp.bill)
            );
    }

    createBill(bill: any) {
        const url = `${ base_url }/bills`;
        return this.http.post( url, bill, this.headers );    
    }
}
import { Component } from '@angular/core';
import { BillService } from 'src/app/services/bill.service';
import { PdfjsService } from 'src/app/services/pdfjs.service';
import { UserService } from 'src/app/services/user.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  bills: any;
  total: number = 0;
  totalEfectivo: number = 0;
  totalBonos: number = 0;

  constructor(
    private pdfjsService : PdfjsService,
    private userService: UserService,
    private billService: BillService
  ) { 
    //billService.getAllBillsByUserId(this.userService.user.uid!)
    billService.getAllBillsByUserId("64b4b9d33aba4e91bb02c8df")    
      .subscribe(
        {
          next: (resp) => {
            this.bills = resp.sort((a: any,b: any) => Number(new Date(a.finDelPeriodo)) - Number(new Date(b.finDelPeriodo)));
            console.log(this.bills)
            this.total = resp.reduce((accumulator:any, currentValue: any) => {
              return accumulator + currentValue.total;
            }, 0);
            this.totalEfectivo = resp.filter((recibo: any) => recibo.tipoDeRecibo === "Salario").reduce((accumulator:any, currentValue: any) => {
              return accumulator + currentValue.total;
            }, 0);
            this.totalBonos = resp.filter((recibo: any) => recibo.tipoDeRecibo === "Bonos").reduce((accumulator:any, currentValue: any) => {
              return accumulator + currentValue.total;
            }, 0);
          },
          error: (e) => console.error(e),
      }
      )
  }

  async onFileSelected(event: any) {
    console.log(event.target.files[0].name)
    console.log(JSON.stringify({
      username: this.userService.user
    }))
    this.pdfjsService.extractText(event, "64b4b9d33aba4e91bb02c8df");
    //this.pdfjsService.extractText(event, this.userService.user.uid!);
  }

  downloadFile() {
    const headers = [
      "Fecha de Pago",
      "Fecha Inicio",
      "Fecha Fin",
      "Tipo de Recibo",
      "Total"
    ];

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      useBom: true,
      headers: headers
    };

    const data = this.bills.map((bill: any) => ({
      "Fecha de Pago": bill.fechaDePago.substring(0, 10),
      "Fecha Inicio": bill.inicioDelPeriodo.substring(0, 10),
      "Fecha Fin": bill.finDelPeriodo.substring(0, 10),
      "Tipo de Recibo": bill.tipoDeRecibo,
      "Total": bill.total
    }))
  
    new ngxCsv(data, "bills", options);
  }
}

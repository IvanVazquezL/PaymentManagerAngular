import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillService } from 'src/app/services/bill.service';

@Component({
    selector: 'app-bill',
    templateUrl: './bill.component.html',
    styleUrls: ['./bill.component.css']
  })

export class BillComponent implements OnInit{

    inicioDelPeriodo: String = "";
    finDelPeriodo: String = "";
    tipoDeRecibo: String = "";
    fechaDePago: String = "";
    percepcionesPropertiesIds: any = [
        "sueldo",
        "premioAsistencia",
        "premioPuntualidad",
        "fondoAhorroTrabajador",
        "despensa",
        "gasolina"
    ]
    deduccionesPropertiesIds: any = [
        "imss",
        "fondoAhorroEmpleado",
        "isr",
        "sgmm",
        "fondoAhorroEmpresa"
    ]
    idToName: any = {
        "sueldo": "Sueldo",
        "premioAsistencia": "Premio Asistencia",
        "premioPuntualidad": "Premio Puntualidad",
        "fondoAhorroTrabajador": "Aportacion Fondo de Ahorro",
        "despensa": "Despensa",
        "gasolina": "Gasolina",
        "imss": "I.M.S.S.",
        "fondoAhorroEmpleado": "Fondo Ahorro Empl",
        "isr": "I.S.R",
        "sggm": "SGGM",
        "fondoAhorroEmpresa": "Fondo Ahorro Trabaj"
    }
    percepciones: any = [];
    deducciones: any = [];
    subtotal: number = 0;
    descuentos: number = 0;
    retenciones: number = 0;
    totalRecibo: number = 0;
    netoDelRecibo: number = 0;

    constructor(
        private activatedRoute: ActivatedRoute,
        private billService: BillService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params
            .subscribe(({id}) => this.loadBill(id));


    }

    loadBill(id: string) {
        this.billService.getBillById(id)
        .subscribe({
            next: (bill) => {
                console.log(bill)
                this.tipoDeRecibo = bill.tipoDeRecibo;
                this.fechaDePago = this.dateFormat(bill.fechaDePago);
                this.inicioDelPeriodo = this.dateFormat(bill.inicioDelPeriodo);
                this.finDelPeriodo = this.dateFormat(bill.finDelPeriodo);
                this.subtotal = bill.subtotal;
                this.descuentos = bill.descuentos;
                this.retenciones = bill.retenciones;
                this.totalRecibo = bill.total;
                this.netoDelRecibo = bill.netoDelRecibo;

                for(const propertyName of this.percepcionesPropertiesIds) {
                    if (propertyName in bill) {
                        this.percepciones.push({
                            name: this.idToName[propertyName],
                            value: bill[propertyName]
                        })
                    }
                }

                for(const propertyName of this.deduccionesPropertiesIds) {
                    if (propertyName in bill) {
                        this.deducciones.push({
                            name: this.idToName[propertyName],
                            value: bill[propertyName]
                        })
                    }
                }
            },
            error: (err) => {
                console.log(err)
            }
        })
    }

    dateFormat(date: string) {
        return date.slice(0,10).replace(/-/g,"/");
    }
}
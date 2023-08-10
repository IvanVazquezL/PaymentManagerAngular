import { Injectable } from "@angular/core";
import { Propiedades } from 'src/app/interfaces/propiedades.interface';
import { BillService } from "./bill.service";

declare const pdfjsLib: any; // Declare pdfjsLib as any to avoid TypeScript errors

@Injectable({
    providedIn: 'root'
})

export class PdfjsService {

    alltext: string[] = [];

    constructor(
        private billService: BillService
    ) {

    }

    async extractText(url: any, userId: string) {
        console.log(url);
        let fr = new FileReader(); // Create a new FileReader object
        fr.readAsDataURL(url.target.files[0]); // Read the file as data URL

        fr.onload = () => {
            let res = fr.result; // Get the result of file reading
            this.extractText_(res, userId);
        }
    }

    async extractText_(url: any, userId: string){
        const pdf = await pdfjsLib.getDocument(url).promise;
        console.log(pdf)

        let pages = pdf.numPages; // Get the total number of pages in the PDF
        for (let i = 1; i <= pages; i++) {
            let page = await pdf.getPage(i); // Get the page object for each page
            let txt = await page.getTextContent(); // Get the text content of the page
            let text = txt.items.map((s: any) => s.str); // Concatenate the text items into a single string
            this.alltext = text.filter((s: string) => s !== "" && s !== " "); // Add the extracted text to the this.alltext
        }

        const KEYWORDS = [
            "Fecha:",
            "Sueldo",
            "I.M.S.S.",
            "Premio Asistencia",
            "eado",
            "Premio Puntualidad",
            "I.S.R. sp",
            "Empresa",
            "SGMM",
            "ador",
            "Subtotal $",
            "Descuentos $",
            "Retenciones $",
            "Total $",
            "Neto del recibo $",
            "Total Percepc. más Otros Pagos  $",
            "Despensa",
            "Gasolina"
        ];

        const propiedades: Propiedades = {
            "Fecha:": "Fecha de Pago",
            "Sueldo": "Sueldo",
            "I.M.S.S.": "I.M.S.S.",
            "Premio Asistencia": "Premio Asistencia",
            "eado": "Fondo Ahorro Empleado",
            "Premio Puntualidad": "Premio Puntualidad",
            "I.S.R. sp": "I.S.R.",
            "Empresa": "Fondo Ahorro Empresa",
            "SGMM": "SGGM",
            "ador": "Fondo Ahorro Trabajador",
            "Subtotal $": "Subtotal",
            "Descuentos $": "Descuentos",
            "Retenciones $": "Retenciones",
            "Total $": "Total",
            "Neto del recibo $": "Neto del Recibo",
            "Total Percepc. más Otros Pagos  $": "Total percepcion mas otros pagos",
            "Despensa": "Despensa",
            "Gasolina": "Gasolina"
        };
    
        const obj: any = {};

        console.log(JSON.stringify(this.alltext, null, 2))
    
        for (let i = 0; i < this.alltext.length; i++) {
            if(this.alltext[i] === "Total Percepc. más Otros Pagos  $") {
                obj[propiedades[this.alltext[i]]] = this.alltext[i - 1];
            } else if(this.alltext[i].includes("Quincenal")) {
              obj["Tipo de Recibo"] = "Salario";
              obj["Inicio del Periodo"] = this.alltext[i + 1];
              obj["Fin del Periodo"] = this.alltext[i + 3];
            } else if(this.alltext[i].includes("Otra Periodicidad")){
              obj["Tipo de Recibo"] = "Otros";
              obj["Inicio del Periodo"] = this.alltext[i + 1];
              obj["Fin del Periodo"] = this.alltext[i + 3];
            }
            else if(this.alltext[i].includes("142 - ")) {
              obj["Nombre"] = this.alltext[i].replace("142 - ", "");
            } else if(KEYWORDS.includes(this.alltext[i])) {
                obj[propiedades[this.alltext[i]]] = this.alltext[i + 1];
            }  
        }
        console.log(JSON.stringify(obj, null, 2))

        const numericFields: {
            [key: string]: string // whatever type of array
        } = {
            "Sueldo": "sueldo",
            "I.M.S.S.": "imss",
            "Premio Asistencia": "premioAsistencia",
            "Fondo Ahorro Empleado": "fondoAhorroEmpleado",
            "Premio Puntualidad": "premioPuntualidad",
            "I.S.R.": "isr",
            "Fondo Ahorro Empresa": "fondoAhorroEmpresa",
            "SGMM": "sggm",
            "Fondo Ahorro Trabajador": "fondoAhorroTrabajador",
            "Subtotal": "subtotal",
            "Descuentos": "descuentos",
            "Retenciones": "retenciones",
            "Total": "total",
            "Neto del Recibo": "netoDelRecibo",
            "Total percepcion mas otros pagos": "totalPercepcionMasOtrosPagos",
            "Despensa": "despensa",
            "Gasolina": "gasolina"
        }

        const bill  :{
            [key: string]: any // whatever type of array
        } = {
            fechaDePagoIdentifier: obj['Fecha de Pago'],
            nombre: obj['Nombre'],
            tipoDeRecibo: obj['Gasolina'] ? "Bonos" : obj['Tipo de Recibo'],
            fechaDePago: new Date(this.spanishDateStringToEnglish(obj['Fecha de Pago'])),
            inicioDelPeriodo: new Date(this.spanishDateStringToEnglish(obj['Inicio del Periodo'])),
            finDelPeriodo: new Date(this.spanishDateStringToEnglish(obj['Fin del Periodo'])),
            userId
        };

        for (const [key, value] of Object.entries(obj)) {
            if (key in numericFields) {
                const numericValue = value as string; // Type assertion here to indicate 'value' is a string
              bill[numericFields[key]] = parseFloat(numericValue.replace(/,/g, ''));
            }
        }

        console.log(JSON.stringify(bill, null, 2));

        this.billService.createBill(bill).subscribe({
            next: (resp) => console.log(resp),
            error: (e) => console.error(e),
        });
    }

    spanishDateStringToEnglish(spanishDate: string) {
        const spanishMonthsToEnglish: {
            [key: string]: string 
        } = {
            "Ene": "Jan",
            "Feb": "Feb",
            "Mar": "Mar",
            "Abr": "Apr",
            "May": "May",
            "Jun": "Jun",
            "Jul": "Jul",
            "Ago": "Aug",
            "Sep": "Sep",
            "Oct": "Oct",
            "Nov": "Nov",
            "Dic": "Dec"
        };
        const spanishMonth = spanishDate.split("/")[1];
        return spanishDate.replace(spanishMonth, spanishMonthsToEnglish[spanishMonth]);
    }
}

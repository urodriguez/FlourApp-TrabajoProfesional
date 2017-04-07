import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InformesServices } from './informesServices';

@Component({
  selector: 'search-bar-factura',
  templateUrl: "app/app_informes/barraBusquedaFacturaComponent.html"
})

export class BarraBusquedaFacturaComponent {
  @Input() tipo: string;
  @Output() searchPerformed = new EventEmitter();

  constructor(private iService: InformesServices) {}

  ngOnInit() {
    this.searchFields.tipoFactura = this.tipo;
  }

  searchFields = {
    tipoFactura: "",
    numeroFactura: "",
    cuit: "",
    nombreEmpresa: "",
    desde: "",
    hasta: ""
  }

  doSearch(event:any) {
    this.iService.getFacturas(this.searchFields).subscribe(
      (informeData) => {
        console.log("OK");
        console.log(informeData);
        //this.searchPerformed.emit(this.searchFields);
      },
      err => console.error("EL ERROR FUE: ", err)
    );
  }
}

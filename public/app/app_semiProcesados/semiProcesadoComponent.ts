import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { SemiProcesadoServices } from './semiProcesadoServices';

@Component({
  selector: 'tabla-semi-procesados',
    templateUrl: "app/app_semiProcesados/semiProcesadoComponent.html"
})

export class SemiProcesadoComponent implements OnInit{
  private nombreUsuario: string;
  private permisos: string;

  private semiProcesados: Response;

  private _id : string;
  private tasaImpositiva: string;
  private nombre: string;
  private cantidad: number;
  private unidad: string;
  private stockMin: number;
  private stockMax: number;
  private embolsado: number;
  private porcentajeMerma: number;
  private tipo: string;
  private precioVenta: number;

  private mostrarModalModificar: boolean = true;
  
  constructor(private spService: SemiProcesadoServices){
    let dataLogin = JSON.parse(sessionStorage.getItem("dataLogin"));
    
    this.nombreUsuario = dataLogin.nombreUsuario;
    this.permisos = dataLogin.permisos;
  }

  ngOnInit() {
    console.log("ON INIT");
    this.cargarSemiProcesados();
  }

  cargarSemiProcesados(){
    console.log("CARGANDO PRODUCTOS TERM");
    // en el momento del subscribe es cuando se dispara la llamada
    this.spService.getSemiProcesados()
              .subscribe(
                (semiProcesadosData) => {
                  this.semiProcesados = semiProcesadosData;
                  console.log(this.semiProcesados);
                },
                err => console.error("EL ERROR FUE: ", err)
              );
  }

  borrar(id: string){
    let r = confirm("¿Realmente desea realizar el borrado?");
    if (r == true) {
        console.log("You pressed OK!");
        console.log("ID borrado= " + id);
        this.spService.borrarSemiProcesado(id)
                      .subscribe(
                        () => { 
                      alert("\t\t\t\t¡Se borro existosamente!\n\nPulse 'Aceptar' para actualizar y visualizar los cambios");
                      window.location.reload();
                      },
                        err => console.error("EL ERROR FUE: ", err)
                      );
    } else {
        console.log("You pressed CANCEL!");
    }
  }

  modificar(semiProcesado: any){
    this._id =                semiProcesado._id;

    switch (semiProcesado.tasaImpositivaID) {
      case "ti1":
        this.tasaImpositiva = "IVA-0%";
        break;
      case "ti2":
        this.tasaImpositiva = "IVA-10.5%";
        break;  
      case "ti3":
        this.tasaImpositiva = "IVA-21%";
        break;
      case "ti4":
        this.tasaImpositiva = "IVA-27%";
        break;  
      default:
        this.tasaImpositiva = "IVA-0%";
        break;
    }

    this.nombre =             semiProcesado.nombre;
    this.cantidad =           semiProcesado.cantidad;
    this.unidad =              semiProcesado.unidad;
    this.stockMin =          semiProcesado.stockMin;
    this.stockMax =           semiProcesado.stockMax;
    this.embolsado =           semiProcesado.embolsadoCantDefault;
    this.porcentajeMerma =     semiProcesado.porcentajeMerma;
    this.tipo =               semiProcesado.tipo;
    this.precioVenta=        semiProcesado.precioVenta;
  }

  guardarModificaciones(){
    if(this.nombre && this.stockMin && this.stockMax) { 
      this.mostrarModalModificar = false;
      let tasaImpositivaID: string;
      switch (this.tasaImpositiva.split("-")[1].split("%")[0]) {
        case "0":
          tasaImpositivaID = "ti1";
          break;
        case "10.5":
          tasaImpositivaID = "ti2";
          break;  
        case "21":
          tasaImpositivaID = "ti3";
          break;
        case "27":
          tasaImpositivaID = "ti4";
          break;  
        default:
          tasaImpositivaID = "ti1";
          break;
      }
      let semiProcesado = {
          _id:                  this._id,
          tasaImpositivaID:     tasaImpositivaID,
          nombre:               this.nombre,
          cantidad:             this.cantidad,
          unidad:               this.unidad,
          stockMin:             this.stockMin,
          stockMax:             this.stockMax,
          embolsadoCantDefault: this.embolsado,
          porcentajeMerma:      this.porcentajeMerma,
          tipo:                 this.tipo,
          precioVenta:          this.precioVenta
      }
      
      console.log(semiProcesado);

      this.spService.modificar(semiProcesado)
                    .subscribe(data => {
                        console.log(data);
                        alert("\t\t¡Producto semiprocesado modificado!\n\nPulse 'Aceptar' para actualizar y visualizar los cambios");
                        window.location.reload();                        
                    }, error => {
                        console.log(JSON.stringify(error.json()));
                        alert("\t\t\t\t¡ERROR al modificar Producto semiprocesado!\n\nRevise los campos");
                    });;
    } else {
      alert("\t\t\t\t¡ERROR!\n\nCampos obligatorios: Nombre - Stock Min - Stock Max");
    }
  }

}
export class Producto {
    constructor(
        public _id?: string,
        public tipo?: string,
        public mp_sp_pt_ID?: string,
        public nombre?: string,
        public cantidad?: number,
        public precioVenta?: number,
        public iva?: number
        ){
    }
}
var mongoose = require("mongoose"); //instancio objeto "mongoose"

var proveedorSchema = new mongoose.Schema({
  clienteID:		 { type: String },
  nombreEmpresa:	 { type: String },
  cuit:   	  		 { type: Number },
  categoriaFiscalID: { type: String },
  listaPrecioID: 	 { type: String },
  direccion: 	  	 { type: String },
  condicionPagoID: 	 { type: String }
});

exports.proveedorModel = mongoose.model('Proveedor', proveedorSchema); //crea el modelo y lo exporta para que lo puedan usar otros modulos
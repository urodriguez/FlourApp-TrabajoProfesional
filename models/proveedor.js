var mongoose = require("mongoose"); //instancio objeto "mongoose"

var proveedorSchema = new mongoose.Schema({
  nombreEmpresa:	 { type: String },
  cuit:   	  		 { type: Number },
  categoriaFiscal:   { type: String },
  direccion: 	  	 { type: String },
  condicionPago: 	 { type: String }
});

exports.proveedorModel = mongoose.model('Proveedor', proveedorSchema); //crea el modelo y lo exporta para que lo puedan usar otros modulos
var mongoose = require("mongoose"); //instancio objeto "mongoose"

var productoSemiProcesadoSchema = new mongoose.Schema({
  tasaImpositivaID:		   { type: String },
  nombre:                 { type: String },
  cantidad:   	  		   { type: Number },
  unidad:				     { type: String },
  stockMin: 	  		     { type: Number },
  stockMax: 	  		     { type: Number },
  stockOptimo:   	{ type: Number },
  embolsadoCantDefault:  	{ type: Number },
  porcentajeMerma: 		 	{ type: Number },
  tipo:     	  		     { type: String },
  listaPorcentajesID:		 { type: String },
  precioVenta:			     { type: Number },
  retenciones_ids:	[{ type: mongoose.Schema.Types.ObjectId, ref: 'Retencion', default:[]}]
  //Se relaciona con listaPorcentajesSchema se inserta en esa tabla este ID y los de los productos con los q se genera este Producto
});

exports.productoSemiProcesadoModel = mongoose.model('ProductoSemiProcesado', productoSemiProcesadoSchema); //crea el modelo y lo exporta para que lo puedan usar otros modulos

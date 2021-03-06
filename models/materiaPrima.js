var mongoose = require("mongoose"); //instancio objeto "mongoose"

var materiaPrimaSchema = new mongoose.Schema({
  tasaImpositivaID:		{ type: String },
  nombre:				{ type: String },
  cantidad: 			{ type: Number },
  unidad:   			{ type: String },
  stockMin: 			{ type: Number },
  stockMax: 			{ type: Number },
  stockOptimo:   	{ type: Number },
  embolsadoCantDefault: { type: Number },
  precioVenta: 			{ type: Number },
  tipo:     			{ type: String },
  retenciones_ids:	[{ type: mongoose.Schema.Types.ObjectId, ref: 'Retencion', default:[]}]

});

exports.materiaPrimaModel = mongoose.model('MateriaPrima', materiaPrimaSchema); //crea el modelo y lo exporta para que lo puedan usar otros modulos

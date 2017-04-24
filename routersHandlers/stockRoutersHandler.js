// Import controller
var productosController = require("../controllers/productosController");

exports.getStockRoutersHandler = function(express){
	var stockRoutersHandler = express.Router();

	stockRoutersHandler.route('/informeEstadoStock')
	  .get(productosController.estadoStock);

	stockRoutersHandler.route('/informeEstadoStock/:id')
	  .get(productosController.ultimosEstadosProducto);

	return stockRoutersHandler;
}

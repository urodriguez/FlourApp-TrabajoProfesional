var mongoose = require('mongoose');
//Import models
var DocumentoMercantil  = require("../models/documentoMercantil").documentoMercantilModel;
var documentoMercantilItemController = require("./documentoMercantilItemController");
var Cliente  = require("../models/cliente").clienteModel;
var Proveedor  = require("../models/proveedor").proveedorModel;

exports.findAll = function(req, res) {
    DocumentoMercantil.find(function(err, documentosmercantiles){
		if(err) res.send(500, err.message);

		console.log('GET/documentosMercantiles');
		res.status(200).jsonp(documentosmercantiles);
		});
};

addFacturaCompleta = function(documentomercantil, items) {
  documentomercantil.save(function(err, documentomercantil) { //almaceno el documentomercantil en la base de datos
  });

  items.map(function(item, index){
    item.documentoMercantilID = documentomercantil._id;
    documentoMercantilItemController.addItem(item, function(){}, function(){});
  })
}

mockFactura = function(req,res,cai, nroFact, tipo, tipoFact, proveedor, condPago, items) {
  var documentomercantil = new DocumentoMercantil({
      tipo:                   tipo,
      puntoDeVenta:           1,
      tipoFactura:            tipoFact,
      numeroFactura:          nroFact,
      fechaEmision:           "2017-04-07",
      comprobanteReferencia:  0,
      empresaID:              proveedor,
      condicionPago:          condPago,
      listaPrecioNombre:      "",
      retencionIG:            0,
      retencionIVA:           0,
      retencionIB:            0,
      impuestosInternos:      0,
      impuestosMunicipales:   0,
      CAI:                    cai,
      fechaVtoCAI:            "2017-05-15"
  });

  return documentomercantil;
}

exports.findFiltered = function(req, res) {
    var busqueda = {
      tipo: req.query.tipo
    }
    DocumentoMercantil.find(busqueda, function(err, documentosmercantiles){
		if(err) res.send(500, err.message);

		console.log('GET/documentosMercantiles');
    console.log(req.query);
    var results = [];
    var finalResults = [];

    function buscarItems(documento) {
      return new Promise(function(resolve, reject) {
          documentoMercantilItemController.findFiltered({documentoMercantilID: documento._id}, function(err, documenTomercantilItem){
            if (err) return reject(err);
            var prods = [];
            var subtotal = 0;
            var totalIVA = 0;
            for (var i = 0; i < documenTomercantilItem.length; ++i) {
              subtotal += documenTomercantilItem[i].precio;
              totalIVA += (documenTomercantilItem[i].precio*documenTomercantilItem[i].iva);
              prods.push(
                {
                  tipo:    	              documenTomercantilItem[i].tipo,
                  productoID:             documenTomercantilItem[i].productoID,
                  nombre:     	          documenTomercantilItem[i].nombre,
                  cantidad:               documenTomercantilItem[i].cantidad,
                  precio:                 documenTomercantilItem[i].precio,
                  iva:                    documenTomercantilItem[i].iva,
                  documentoMercantilID:   documenTomercantilItem[i].documentoMercantilID
                }
              );
            }
            var otros = 0;
            otros += (subtotal*documento.retencionIG);
            otros += (subtotal*documento.retencionIVA);
            otros += (subtotal*documento.retencionIB);
            otros += (subtotal*documento.impuestosInternos);
            otros += (subtotal*documento.impuestosMunicipales);
            results.push(
              {
                  tipo:                   documento.tipo,
                  puntoDeVenta:           documento.puntoDeVenta,
                  tipoFactura:            documento.tipoFactura,
                  numeroFactura:          documento.numeroFactura,
                  fechaEmision:           documento.fechaEmision,
                  fechaVencimiento:       documento.fechaVencimiento,
                  comprobanteReferencia:  documento.comprobanteReferencia,
                  empresaID:              documento.empresaID,
                  condicionPago:          documento.condicionPago,
                  listaPrecioNombre:      documento.listaPrecioNombre,
                  retencionIG:            documento.retencionIG,
                  retencionIVA:           documento.retencionIVA,
                  retencionIB:            documento.retencionIB,
                  impuestosInternos:      documento.impuestosInternos,
                  impuestosMunicipales:   documento.impuestosMunicipales,
                  CAI:                    documento.CAI,
                  fechaVtoCAI:            documento.fechaVtoCAI,
                  productos: prods,
                  subtotal: subtotal,
                  iva:  totalIVA,
                  otros: otros,
                  total: subtotal+totalIVA+otros
              }
            );
            resolve(documenTomercantilItem);
          });
      });
    }

    function buscarEmpresa(documento) {
      return new Promise(function(resolve, reject) {
        if(documento.tipo == "Compra" || documento.tipo == "compra") {
          Proveedor.findById(documento.empresaID, function(err, empresa){

          });
        }
        if(documento.tipo == "Venta" || documento.tipo == "venta") {
          Cliente.findById(documento.empresaID, function(err, empresa){

          });
        }
      });
    }

    var promises = [];
    for (var i = 0; i < documentosmercantiles.length; ++i) {
        promises.push(buscarItems(documentosmercantiles[i]));
        // promises.push(buscarEmpresa(documentosmercantiles[i]));
    }
    Promise.all(promises).then(function() {
      res.status(200).jsonp(results);
    }, function(err) {
        res.send(500, err.message);
    });
  });
};


exports.findById = function(req, res) {
	var findByIdCallback =
	function(err, documentomercantil){
		if(err) return res.send(500, err.message);

		console.log('GET/documentosmercantiles/' + req.params.id);
		res.status(200).jsonp(documentomercantil);
    };

    DocumentoMercantil.findById(req.params.id, findByIdCallback); //luego de realizar la busqueda ejecuta el callback
};

exports.findByTipo = function(req, res) {
    var findByTipoCallback =
    function(err, documentosmercantiles){
        if(err) return res.send(500, err.message);

        console.log('GET/documentosmercantiles/' + req.params.tipo);
        res.status(200).jsonp(documentosmercantiles);
    };

    DocumentoMercantil.find({tipo: req.params.tipo}, findByTipoCallback); //luego de realizar la busqueda ejecuta el callback
};


exports.add = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var documentomercantil = new DocumentoMercantil({ //creo un nuevo documentomercantil en base a lo recibido en el request
        tipo:                   req.body.tipo,
        puntoDeVenta:           req.body.puntoDeVenta,
        tipoFactura:            req.body.tipoFactura,
        numeroFactura:          req.body.numeroFactura,
        fechaEmision:           req.body.fechaEmision,
        fechaVencimiento:       req.body.fechaVencimiento,
        comprobanteReferencia:  req.body.comprobanteReferencia,
        empresaID:              req.body.empresaID,
        condicionPago:          req.body.condicionPago,
        listaPrecioNombre:      req.body.listaPrecioNombre,
        retencionIG:            req.body.retencionIG,
        retencionIVA:           req.body.retencionIVA,
        retencionIB:            req.body.retencionIB,
        impuestosInternos:      req.body.impuestosInternos,
        impuestosMunicipales:   req.body.impuestosMunicipales,
        CAI:                    req.body.CAI,
        fechaVtoCAI:            req.body.fechaVtoCAI
    });

    documentomercantil.save(function(err, documentomercantil) { //almaceno el documentomercantil en la base de datos
        if(err) return res.status(500).send( err.message);
        res.status(200).jsonp(documentomercantil);
    });

};


exports.update = function(req, res) {
	console.log('UPDATE');
    console.log(req.body);

    DocumentoMercantil.findById(req.params.id, function(err, documentomercantil) { //"documentomercantil" es el objeto que me devuelve la busqueda

		//actualizo todos los campos de ese "documentomercantil"
        documentomercantil.tipo =                   req.body.tipo;
        documentomercantil.puntoDeVenta =           req.body.puntoDeVenta;
        documentomercantil.tipoFactura =            req.body.tipoFactura;
        documentomercantil.numeroFactura =          req.body.numeroFactura;
        documentomercantil.fechaEmision =           req.body.fechaEmision;
        documentomercantil.fechaVencimiento =       req.body.fechaVencimiento;
        documentomercantil.comprobanteReferencia =  req.body.comprobanteReferencia;
        documentomercantil.empresaID =              req.body.empresaID;
        documentomercantil.condicionPago =          req.body.condicionPago;
        documentomercantil.listaPrecioNombre =      req.body.listaPrecioNombre;
        documentomercantil.retencionIG =            req.body.retencionIG;
        documentomercantil.retencionIVA =           req.body.retencionIVA;
        documentomercantil.retencionIB =            req.body.retencionIB;
        documentomercantil.impuestosInternos =      req.body.impuestosInternos;
        documentomercantil.impuestosMunicipales =   req.body.impuestosMunicipales;
        documentomercantil.CAI =                    req.body.CAI;
        documentomercantil.fechaVtoCAI =            req.body.fechaVtoCAI;

        documentomercantil.save(function(err) { //almaceno en la base "documentomercantil" para que quede actualizada con los nuevos cambios
            if(err) return res.status(500).send(err.message);
			res.status(200).jsonp(documentomercantil);
        });
    });
};


exports.delete = function(req, res) {
	console.log('DELETE');
	console.log(req.params.id);

    DocumentoMercantil.findById(req.params.id, function(err, documentomercantil) {
        documentomercantil.remove(function(err) {
            if(err) return res.status(500).send(err.message);
			res.status(200).send(documentomercantil);
        })
    });
};

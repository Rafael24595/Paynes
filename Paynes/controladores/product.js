require('../modelos/product');

const mongoose = require('mongoose');
const products = mongoose.model('Product');

async function generateDatabase(req, res) {
  try {
    const newProducts = [
      {"id_product":"shirt_001","name":"Hawaiana con loros","category":"shirt","description":" Camisa hawaiana con loros que est\u00e1 causando furor entre los turistas en algunas regiones de Brasil","price":16,"stock":1,"en_last_unit":1},
      {"id_product":"shirt_002","name":"Hawaiana hortera","category":"shirt","description":"Camisa hawaiana hortera con un patr\u00f3n absurdo que no le regalar\u00eda ni a mi peor enemigo","price":19,"stock":10,"en_last_unit":1},
      {"id_product":"shirt_003","name":"Hawaiana con flores","category":"shirt","description":"Camisa hawaiana con flores rosas hecha a medida para el inform\u00e1tico tropical. Si se mancha de espuma de afeitar, por alguna raz\u00f3n, hay que lavarla a mano","price":16,"stock":2,"en_last_unit":17},
      {"id_product":"shirt_004","name":"Hawaiana roja","category":"shirt","description":"Camisa hawaiana roja con un patr\u00f3n de hojas en color blanco que una vez llev\u00f3 un hombre al que llamaban El Rey","price":20,"stock":1,"en_last_unit":23},
      {"id_product":"shirt_005","name":"Hawaiana azul","category":"shirt","description":"Camisa hawaiana azul celeste sospechosa de la cual solo se hicieron dos unidades, si ves a alguien m\u00e1s portando esta camisa por la calle yo que t\u00fa me har\u00eda a un lado","price":40,"stock":1,"en_last_unit":1},
      {"id_product":"shirt_006","name":"Hawaiana de tortuga","category":"shirt","description":"Camisa hawaiana naranja que fue sensac\u00edon hace unas cuantas d\u00e9cadas, la favorita de las tortugas de mar","price":34,"stock":3,"en_last_unit":1}
    ]

    products.remove({}, function(err) { 

      console.log('Database removed'); 

    });

   newProducts.forEach(product=>{

      new products(product).save();

   });
    return res.send({
      status: 'success'
    });
  } catch (error) {
    return res.status(400).send({
      status: 'failure'
    });
  }
}
async function getAll(req, res) {
	try {
      const allProducts = await products.find({});
      return res.send(allProducts && allProducts.length ? allProducts : []);
    } catch (error) {
      return res.status(400).send({
        status: 'failure'
      });
    }
}
async function getOffer(req, res) {
	try {
      const allProducts = await products.find({stock:{$lt:req.query.lastUnitsStock},en_last_unit:1});
      return res.send(allProducts && allProducts.length ? allProducts : []);
    } catch (error) {
      return res.status(400).send({
        status: 'failure'
      });
    }
}
async function getCategory(req, res) {
	try {
      const allProducts = await products.find({category:req.query.category});
      return res.send(allProducts && allProducts.length ? allProducts : []);
    } catch (error) {
      return res.status(400).send({
        status: 'failure'
      });
    }
}
async function getCategoriesIcon(req, res) {

  const categories = req.query.categoriesIcons;
  var categoriesData = [];
  var count = 0;

  await categories.forEach(category=>{

    categoriesData = (categoriesData.length == 0) ? [] : categoriesData;
    var categoryName = category.category.split("_")[1];

    try {
      products.findOne({category:categoryName}, function(err, product){

        category.image = (product) ? product.id_product : null;
        categoriesData.push(category);

        count ++;

        if (count == categories.length) {
          
          callBack(req, res, categoriesData);

        }

      });
    } catch (error) {
      return res.status(400).send({
        status: 'failure'
      });
    }

  });

}
async function getGallery(req, res) {
  
  const testFolder = './public/media/images/gallery';
  const fs = require('fs');

  fs.readdir(testFolder, (err, files) => {console.log(files);
    return res.send(files && files.length ? files : []);
  });

}
async function saleProceed(req, res) {
	
  const productsToBuy = JSON.parse(req.body.products);
  var count = 0;
  var errCount = 0;
  var errProducts = [];

  productsToBuy.forEach(productToBuy=>{

    try {
      products.findOne({id_product:productToBuy.id_product}, function(err, product){
        
        if (product.stock >= productToBuy.lot) {
          
          product.stock = product.stock - productToBuy.lot;

          if (product.stock < 1) {
            
            products.deleteOne({id_product:product.id_product}, function(err, obj){

                if (err){

                  throw err;
                  errCount = errCount + 1;
                  errProducts.push(product);

                }

            });

          }
          else{

            products.updateOne({id_product:product.id_product}, product, function(err, obj){

              if (err){

                throw err;
                errCount = errCount + 1;
                errProducts.push(product);

              }

          });

          }

        }
        else{

          errCount = errCount + 1;
          errProducts.push(product);

        }

        count ++;
console.log(count); console.log(productsToBuy.length)
        if (count == productsToBuy.length) {
          
          errProducts.push(errCount);

          callBack(req, res, errProducts);

        }

      });
    } catch (error) {
      return res.status(400).send({
        status: 'failure'
      });
    }

  });

}
async function addNuevo(req, res) {
    try {
	  const fruta= req.body;
      await new products(fruta).save();
      return res.send({
        status: 'success'
      });
    } catch (error) {
      return res.status(400).send({
        status: 'failure'
      });
    }
  }

async function modificar(req, res) {
   try {
      const fruta= req.body;
      await products.updateOne({'_id':fruta._id},fruta);
      return res.send({
        status: 'success'
      });
    } catch (error) {
      return res.status(400).send({
        status: 'failure'
      });
    }
}

async function eliminar(req, res) {
    try {
      await products.deleteOne({'_id':req.params.id});
      return res.send({
        status: 'success'
      });
    } catch (error) {
      return res.status(400).send({
        status: 'failure'
      });
    }
}

function callBack(req, res, data){

  return res.send(data);

}

module.exports = {generateDatabase, getOffer, getCategory, getCategoriesIcon, getGallery, saleProceed, eliminar, modificar, addNuevo, getAll};

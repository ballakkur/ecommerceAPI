const mongoose = require('mongoose');
const shortid = require('shortid');

//libraries
const response = require('./../library/responseLib');
const time = require('./../library/timeLib');
const check = require('./../library/checkLib');
const logger = require('./../library/logLib');

const productModel = mongoose.model('ecommerce');

//find a product by its name
let readProd = (req, res) => {
    if (check.isEmpty(req.params.name)) {
        // console.log('product name must be passed');
        logger.error('no name found', 'prodContrller:readProd', 10);
        let apiResonse = response.generate(true, 'name is missing', 403, null);
        res.send(apiResonse);
    } else {
        let readProdFunc = async () => {
            try {
                const result = await productModel
                    .findOne({ 'name': req.params.name })
                    .select('-__v -_id');
                if (check.isEmpty(result)) {
                    let apiResponse = response.generate(false, `no Product of the name ${req.params.name} found`, 200, result);
                    res.send(apiResponse);
                } else {
                    let apiResponse = response.generate(false, 'Product Found Successfully.', 200, result)
                    res.send(apiResponse);
                }

            } catch (error) {
                logger.error(error, 'prodController:readProdBFunc', 10);
                let apiResonse = response.generate(error, "invalid input params", 403, null);
                res.send(apiResonse);
            }
        }
        readProdFunc();
    }
}
//find a product by its price
let readProdByPrice = (req, res) => {
    if (check.isEmpty(req.params.price)) {
        console.log('product price must be passed');
        // logger.error('no price found','prodContrller:readProdByPrice',10);
        let apiResonse = response.generate(true, 'price is missing', 403, null);
        res.send(apiResonse);
    } else {
        let readProdByPriceFunc = async () => {
            try {
                const result = await productModel
                    .findOne({ 'price': req.params.price })
                    .select('-__v -_id');
                if (check.isEmpty(result)) {
                    let apiResponse = response.generate(false, `no Product with price: ${req.params.price} found`, 200, result);
                    res.send(apiResponse);
                } else {
                    let apiResponse = response.generate(false, 'Product Found Successfully.', 200, result)
                    res.send(apiResponse);
                }

            } catch (error) {
                logger.error(error, 'prodController:readProdByPriceFunc', 10);
                let apiResonse = response.generate(null, "invalid input params", 403, "must provide price whose type is number");
                res.send(apiResonse);
            }
        }
        readProdByPriceFunc();
    }
}

//to list all product in the database
let listProd = (req, res) => {
    let listProdFunc = async () => {
        try {
            const result = await productModel
                .find()
                .select('-__v -_id')
            if (check.isEmpty(result)) {
                logger.info("No products Found", "prodContrller:listProdFunc", 5);
                let apiResonse = response.generate(true, 'no prducts found', 404, null)
                res.send(apiResonse);
            }
            else {
                res.send(result);
                logger.info(result, "prodContrller:listProdFunc", 5);
            }
        }
        catch (err) {
            let apiResonse = response.generate(true, "failed to fetch data", 500, null);
            // logger.error(err, "prodContrller:listProdFunc", 10);
            res.send(apiResonse);

        }
    }
    listProdFunc();
}
//to add product to the database
let createProd = (req, res) => {
    let createProdFunc = async () => {
        // console.log(req.body);
        logger.info(req.body, "prodController:createProd function", 5);
        const newid = shortid.generate();
        const currentDate = time.now();
        const addCategory = (req.body.category != undefined && req.body.category != null && req.body.category != '') ? req.body.category.split(',') : []
        console.log(addCategory);
        // logger.info(currentDate, "prodController:createProd function", 5)
        if (check.isEmpty(req.body.name) || check.isEmpty(req.body.description)
            || check.isEmpty(req.body.price)) {
            logger.error("403 forbidden request", "prodController:createProd function", 10)
            let apiResonse = response.generate(true, 'required parameter are missing', 403, null)
            res.send(apiResonse);
        }
        else {
            let product = new productModel({
                id: newid,
                name: req.body.name,
                description: req.body.description,
                quantity: req.body.quantity,
                price: req.body.price,
                category: addCategory,
                image: req.body.image,
                created: currentDate
            });
            try {
                const result = await product.save()
                res.send("data saved successfully");
                logger.info(result, "prodController:createProd function", 10)
            } catch (err) {
                logger.error(err, "prodController:createProd function", 10)
            }
        }
    }
    createProdFunc();
}
//to delete products from database
let deleteProd = (req, res) => {
    let deleteProdFunc = async () => {
        try {
            let result = await productModel.remove({ 'id': req.params.id });
            logger.info(result,'prodController:deleteProdFunc',5);
            if(result.n === 0){
            let apiResonse = response.generate(true,`${req.params.id} not found`,400,null);
                res.send(apiResonse);
                return;
            }
            let apiResonse = response.generate(false,`${req.params.id} deleted`,200,null);
            res.send(apiResonse);
        } catch (error) {
            logger.error('some error occured','prodController:deleteprodFunc',10);
            res.send(error);
        }

    }
    deleteProdFunc();
}
//delete by name
let deleteProdByName = (req, res) => {
    let deleteProdByNameFunc = async () => {
        try {
            let result = await productModel.remove({ 'name': req.params.name });
            logger.info(result,'prodController:deleteProdByNameFunc',5);
            if(result.n === 0){
            let apiResonse = response.generate(true,`${req.params.name} not found`,400,null);
                res.send(apiResonse);
                return;
            }
            let apiResonse = response.generate(false,`${req.params.name} deleted`,200,null);
            res.send(apiResonse);
        } catch (error) {
            logger.error('some error occured','prodController:deleteprodByNameFunc',10);
            res.send(error);
        }

    }
    deleteProdByNameFunc();
}
//function to edit a product details
let editProd = (req,res)=>{
    let editProdFunc = async ()=>{
        const id  = req.params.id;
        const changes = req.body;
        if(changes.id){
          const apiResonse = response.generate(true,'Forbidden,cannot modify Id',403);
          res.send(apiResonse);
          return;
        }
        changes.lastUpdated = time.now();
        console.log(changes);
        try{
            const result = await productModel.update({id:id},changes);
            logger.info(result,'editProdFunc:prodController',5);
            if(result.nModified === 1 && result.n === 1){
                const apiResonse = response.generate(false,'successfully modified',200,result);
                res.send(apiResonse);
           } 
           else if (result.nModified === 0 && result.n ==1){
            const apiResonse = response.generate(false,'no changes from original data',200,result);
            res.send(apiResonse);  
           }
           else{
            const apiResonse = response.generate(true,'Id not found',404,result);
            res.select(apiResonse);
           }
        }
        catch(err){
            const apiResonse = response.generate(true,'bad request',400);
            res.send(apiResonse);
        }
    }
    editProdFunc();
}
module.exports = {
    createProd,
    readProd,
    readProdByPrice,
    listProd,
    editProd,
    deleteProd,
    deleteProdByName
}
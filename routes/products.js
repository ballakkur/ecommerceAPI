const appConfig = require('./../config/appConfig');
const controller = require('./../controller/prodController');
const auth = require('./../middlewares/auth');
let setRouter = (app) => {
     let baseUrl = appConfig.apiVersion +'/ecart';
    app.get(baseUrl +'/view/:name',controller.readProd);
    /**
     * @api {get} /api/v1/ecart/view/:name view product detail by name
     * @apiVersion 0.0.1
     * @apiGroup Read
     * 
     * @apiParam {string} name The name of the product must be passed as url parameter
     * 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"product Found Sucessfully",
         "status":200,
         "data":{
                    Id:"string",
                    name:"string",
                    category:array,
                    quantity:number,
                    description:"string",
                    price:number
                    created:date,
                    lastUpdated:date,
                }
       }
    * @apiErrorExample {json} on-error: 
    *
    *   {
         "error": true,
         "message":no product of name found,
         "status": 200,
         "data": null
        }
     */
    app.get(baseUrl +'/view/byprice/:price',controller.readProdByPrice);
    /**
     * @api {get} /api/v1/ecart/view/byprice/:price view product detail by price
     * @apiVersion 0.0.1
     * @apiGroup Read
     * 
     * @apiParam {number} price The price of the product must be passed as url parameter
     * 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"product Found Sucessfully",
         "status":200,
         "data":{
                    Id:"string",
                    name:"string",
                    category:array,
                    quantity:number,
                    description:"string",
                    price:number
                    created:date,
                    lastUpdated:date,
                }
       }
    * @apiErrorExample {json} on-error: 
    *
    *   {
         "error": true,
         "message":no product with price '' found,
         "status": 200,
         "data": null
        }
     */
    app.get(baseUrl +'/list',controller.listProd);
    /**
     * @api {get} /api/v1/ecart/list view all product detail
     * @apiVersion 0.0.1
     * @apiGroup Read
     * 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"product Found Sucessfully",
         "status":200,
         "data":{
                    Id:"string",
                    name:"string",
                    category:array,
                    quantity:number,
                    description:"string",
                    price:number
                    created:date,
                    lastUpdated:date,
                }
       }
    * @apiErrorExample {json} on-error: 
    *
    *   {
         "error": true,
         "message":no product found,
         "status": 200,
         "data": null
        }
     */
    app.post(baseUrl +'/create',auth.isAuthenticated,controller.createProd); 
    /**
     * @api {post} /api/v1/ecart/create create a product
     * @apiVersion 0.0.1
     * @apiGroup Create
     * 
     * @apiParam {string} authToken The token for authentication.(Send authToken(Admin) as query parameter, body parameter or as a header)
     * @apiParam {string} name This is the name of the product (required)
     * @apiParam {string} description This is the description of the product (required)
     * @apiParam {number} price This is the price of the product (required)
     * @apiParam {number} quantity This is the quantity of the product
     * @apiParam {array} category category(tags) array is passed as array
     * @apiParam {url} image url of image 
     * 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"prduct saved sucessfully",
         "status":200
       }
       @apiErrorExample {json} on-error: 
     * 
     * {
         "error": true,
         "message":error message that was generated,
         "status": 500,
         "data": null
        }
     */
    app.post(baseUrl + '/delete/:id',controller.deleteProd);
    /**
     * @api {post} /api/v1/ecart/delete/:id delete a product
     * @apiVersion 0.0.1
     * @apiGroup Delete
     * 
     * @apiParam {string} id This is the id of the product to be deleted(sent as url parameter)
     * 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"deleted",
         "status":200
       }
       @apiErrorExample {json} on-error: 
     * 
     * {
         "error": true,
         "message": id ' ' not found,
         "status": 500,
         "data": null
        }
     */
    app.post(baseUrl + '/delete/byName/:name',controller.deleteProdByName);
    /**
     * @api {post} /api/v1/ecart/delete/byName/:name delete product by name
     * @apiVersion 0.0.1
     * @apiGroup Delete
     * 
     * @apiParam {string} name This is the name of the product to be deleted(sent as url parameter)
     * 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"deleted",
         "status":200
       }
       @apiErrorExample {json} on-error: 
     * 
     * {
         "error": true,
         "message": id ' ' not found,
         "status": 500,
         "data": null
        }
     */
    app.put(baseUrl + '/edit/:id',controller.editProd);
    /**
     * @api {put} /api/v1/ecart/edit/:id edit product item
     * @apiVersion 0.0.1
     * @apiGroup Edit
     * 
     * @apiParam {string} id The product Id must be passed as url parameter 
     * @apiParam {string} name This is the name of the product 
     * @apiParam {string} description This is the description of the product 
     * @apiParam {number} price This is the price of the product
     * @apiParam {number} quantity This is the quantity of the product
     * @apiParam {array} category category(tags) array is passed as array
     * @apiParam {url} image url of image 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"successfully modified",
         "status":200,
         "data":{
                    Id:"string",
                    name:"string",
                    category:array,
                    quantity:number,
                    description:"string",
                    price:number
                    created:date,
                    lastUpdated:date,
                }
       }
    *@apiErrorExample {json} on-error: 
    * {
         "error": true,
         "message":no change from original data or id not found,
         "status": 404,
         "data": null
        }

     */
}
module.exports = {
    setRouter:setRouter
}
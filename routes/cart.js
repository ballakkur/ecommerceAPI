const appConfig = require('./../config/appConfig');
const controller = require('./../controller/cartController');
const auth = require('./../middlewares/auth');
let setRouter = (app) => {
    let baseUrl = appConfig.apiVersion + '/shop';
    app.post(baseUrl + '/create',auth.isAuthenticated,controller.cartcreate);
    /**
     * @api {post} /api/v1/shop/create create a cart
     * @apiVersion 0.0.1
     * @apiGroup Create
     * 
     * @apiParam {string} authToken The token for authentication.(Send authToken(Admin) as query parameter, body parameter or as a header)
     * @apiParam {string} id This is the id of the product that is to be added to cart(sent as key value pair in body parameter)
     * 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"cart saved sucessfully",
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
    app.get(baseUrl + '/show/:id', controller.showCart);
    /**
     * @api {get} /api/v1/shop/show/:id get cart by cartId 
     * @apiVersion 0.0.1
     * @apiGroup Read
     * 
     * @apiParam {string} cartId The id of the cart (cartId) must be passed as url parameter
     * 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"cart Found Sucessfully",
         "status":200,
         "data":{
                    itemsId:object(type=array),
                    cartId:"string",
                    totalItem:number,
                    totalAmount:number,
                    lastUpdated:Date
                }
       }
    * @apiErrorExample {json} on-error: 
    *
    *   {
         "error": true,
         "message":no cart of the id found,
         "status": 500,
         "data": null
        }
     */
    app.put(baseUrl + '/addToCart/:id/:itemId', controller.addToCart);
    /**
     * @api {put} /api/v1/shop/addToCart/:id/:itemId add items to cart
     * @apiVersion 0.0.1
     * @apiGroup Edit
     * 
     * @apiParam {string} id The cartId must be passed as url parameter 
     * @apiParam {string} itemId The Id of products must be passed as url parameter 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"Sucessfully modified",
         "status":200,
         "data": {
                    "itemsId": object(type=array),
                    "_id": "string",
                    "cartId": "string",
                    "totalItem": number,
                    "totalAmount": number,
                    "lastUpdated": date
                }
       }
    *@apiErrorExample {json} on-error: 
    * {
         "error": true,
         "message":no cart of the id found,
         "status": 404,
         "data": null
        }

     */
    app.post(baseUrl + '/deleteFromCart/:id/:itemId', controller.removeFromCart);
    /**
     * @api {post} /api/v1/shop/deleteFromCart/:id/:itemId delete item from a cart
     * @apiVersion 0.0.1
     * @apiGroup Delete
     * 
     * @apiParam {string} id This is the id of the cart(cartId)(sent as a url parameter)
     * @apiParam {string} itemId This is the id of the product that is to be deleted from cart(sent as a url parameter)
     * 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"deleted successfully",
         "status":200
         "data":{ n: 1, nModified: 1, ok: 1 }
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
    app.post(baseUrl + '/delete/:id', controller.cartDelete);
    /**
     * @api {post} /api/v1/shop/delete/:id delete a cart
     * @apiVersion 0.0.1
     * @apiGroup Delete
     * 
     * @apiParam {string} id This is the id of the cart to be deleted(sent as url parameter)
     * 
     * @apiSuccessExample {json} on-success:
     * { 
         "error":false,
         "message":"cart deleted sucessfully",
         "status":200
       }
       @apiErrorExample {json} on-error: 
     * 
     * {
         "error": true,
         "message":cart with id ' ' not found,
         "status": 500,
         "data": null
        }
     */
}
module.exports = {
    setRouter
}
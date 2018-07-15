const mongoose = require('mongoose');
const shortId = require('shortid');

//libraries
const response = require('./../library/responseLib');
const time = require('./../library/timeLib');
const check = require('./../library/checkLib');
const logger = require('./../library/logLib');

const ecartModel = mongoose.model('cart');
const productModel = mongoose.model('ecommerce');
let findIdFunc = async (idArray) => {
    let data;
    try {
        data = await productModel
            .find({ id: idArray })
            .select('-_id')
            .select('price');
        return data;
        // console.log(data);
    }
    catch (err) {
        logger.error(err, 'cartController:findIdFunc', 9);
        let apiResponse = response.generate(true, err.message, 404, null);
        res.send(apiResponse);
    }

}
//find by id function
let findById = async (cartId) => {
    try {
        let result = await ecartModel.findOne({ 'cartId': cartId })
            .select();
        // console.log(result);   
        return result;
    }
    catch (err) {
        logger.error(err, 'cartController:findById', 10);
        res.send('try again');
    }
}
//updating other fields after performing add or remove item
let restUpdate = async (result) => {
    let sum = 0;
    let amount
    try {
        amount = await findIdFunc(result.itemsId);
        // console.log(amount);
    }
    catch (err) {
        console.log(err);
    }
    amount.forEach(element => {
        sum += element.price;
    });
    // console.log(sum);
    result.totalAmount = sum;
    result.lastUpdated = time.now();
    result.totalItem = result.itemsId.length;
    return result;
}
//show cart items
let showCart = (req, res) => {
    if (check.isEmpty(req.params.id)) {
        // logger.error('no id found', 'cartContrller:showCart', 10);
        let apiResonse = response.generate(true, 'id is missing', 403, null);
        res.send(apiResonse);
    } else {
        let showCartFunc = async () => {
            try {
                const result = await ecartModel
                    .findOne({ 'cartId': req.params.id })
                    .select('-__v -_id');
                if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, `no cart of the id ${req.params.id} found`, 500,null);
                    res.send(apiResponse);
                } else {
                    let apiResponse = response.generate(false, 'cart Found Successfully.', 200, result)
                    res.send(apiResponse);
                }

            } catch (error) {
                logger.error(error, 'cartController:showCartFunc', 10);
                let apiResonse = response.generate(error, "invalid input params", 403, null);
                res.send(apiResonse);
            }
        }
        showCartFunc();
    }
}
let cartcreate = (req, res) => {

    let cartcreateFunc = async () => {
        let sum = 0;
        let cartData = req.body.id;
        let totalItem = cartData.length;
        // console.log(totalItem);
        let newId = shortId.generate();
        console.log(newId);
        // console.log(cartData);
        let newDate = time.now();
        // console.log(newDate);
        try {
            var amount = await findIdFunc(cartData);
            // console.log(amount);
            logger.info(amount, 'cartController:createCartFunc', 5);
        }
        catch (err) {
            // console.log('some error occured')
            logger.error(err, 'cartController:cartCreateFunc', 10);
            return;
        }
        amount.forEach(element => {
            sum += element.price;
        });
        console.log(sum);
        let newCart = new ecartModel({
            cartId: newId,
            totalItem: totalItem,
            itemsId: cartData,
            created: newDate,
            lastUpdated: newDate,
            totalAmount: sum
        })
        try {
            const result = await newCart.save();
            console.log(result);
            let apiResponse = response.generate(false, 'cart saved sucessfully', 200);
            res.send(apiResponse);
        }
        catch (err) {
            console.log(err.message);
            // logger.error(err,'cartController:cartCreateFunc',10);
        }
    }
    cartcreateFunc();
}
//add items to cart
let addToCart = (req, res) => {
    let cartId = req.params.id;
    let itemId = req.params.itemId;
    let addToCartFunc = async () => {
        let flag = false;
        /* let sum = 0;
        let amount */
        let result = await findById(cartId);
        if (check.isEmpty(result)) {
            let apiResonse = response.generate(true, `cart with id ${cartId} not found`, 404, null)
            res.send(apiResonse);
        }
        else {
            console.log(result);
            result.itemsId.forEach(element => {
                if (element === itemId) {
                    let apiResonse = response.generate(true, 'item already exists in cart', 500, null);
                    res.send(apiResonse);
                    flag = true;
                }
            });
            if (flag === false) {
                result.itemsId.push(itemId);
                result = await restUpdate(result);
                console.log(result)
                //finally update it to database
                try {
                    const finalResult = await ecartModel.update({ cartId: cartId }, result);
                    // logger.info(finalResult, 'addToCartFunc:cartController', 5);
                    console.log(finalResult);
                    if (finalResult.nModified === 1 && finalResult.n === 1) {
                        const apiResonse = response.generate(false, 'successfully modified', 200, result);
                        res.send(apiResonse);
                    }
                    else if (finalResult.nModified === 0 && finalResult.n == 1) {
                        const apiResonse = response.generate(false, 'no changes from original data', 200, result);
                        res.send(apiResonse);
                    }
                    else {
                        const apiResonse = response.generate(true, 'cartId not found', 404, result);
                        res.send(apiResonse);
                    }
                }
                catch (err) {
                    const apiResonse = response.generate(true, 'bad request', 400);
                    res.send(apiResonse);
                    console.log(err);
                }
            }
        }

    }

    addToCartFunc()
}
// remove item from cart
let removeFromCart = (req, res) => {
    let removeFromCartFunc = async () => {
        let cartId = req.params.id;
        let itemId = req.params.itemId;
        let result = await findById(cartId);
        console.log(result);
        if (check.isEmpty(result)) {
            let apiResonse = response.generate(true, `cart with id ${cartId} not found`, 404, null)
            res.send(apiResonse);
        }
        else {
            try {
                // let removedDoc = await ecartModel.remove({ itemsId: itemId });
                let removedDoc = await ecartModel.update({ cartId: cartId }, { $pullAll: { itemsId: [itemId] } });
                console.log(removedDoc)
                if (removedDoc.nModified === 0 && removedDoc.n === 1) {
                    let apiResonse = response.generate(true, `item with id ${itemId} not found`, 200, removedDoc);
                    res.send(apiResonse);
                } else if (removedDoc.n === 1 && removedDoc.nModified === 1) {
                    let apiResonse = response.generate(false, `deleted successfully ${itemId}`, 200, removedDoc);
                    //recall the result since its modified
                    let result = await findById(cartId);
                    //update result here
                    let newResult = await restUpdate(result);
                    try {
                        const finalResult = await ecartModel.update({ cartId: cartId }, newResult);
                        console.log('updated cart')
                        console.log(finalResult);
                    }
                    catch (err) {
                        console.log(err)
                    }
                    res.send(apiResonse);
                    console.log(removedDoc);
                } else {
                    let apiResonse = response.generate(true, 'delete not successfull', 200, removedDoc);
                    res.send(apiResonse);
                }
            } catch (err) {
                let apiResonse = response.generate(err, 'some error occured', 404);
                res.send(apiResonse);
                console.log(err);
            }
        }
    }
    removeFromCartFunc();
}
//delete cart completely
let cartDelete = (req,res)=>{
    let cartDeleteFunc = async () => {
        try {
            let result = await ecartModel.remove({ 'cartId': req.params.id });
            logger.info(result,'cartController:cartDeleteFunc',5);
            if(result.n === 0){
            let apiResonse = response.generate(true,`${req.params.id} not found`,400,null);
                res.send(apiResonse);
                return;
            }
            let apiResonse = response.generate(false,`${req.params.id} deleted`,200,null);
            res.send(apiResonse);
        } catch (error) {
            logger.error('some error occured','cartController:cartDeleteFunc',10);
            res.send(error);
        }

    }
    cartDeleteFunc();
}
module.exports = {
    cartcreate,
    addToCart,
    removeFromCart,
    cartDelete,
    showCart
}
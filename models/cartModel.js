const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    cartId:{
        type:String
    },
    totalItem:{
        type:Number
    },
    itemsId:[],
    created:{
        type:Date
    },
    lastUpdated:{
        type:Date
    },
    totalAmount:{
        type:Number
    }
})
mongoose.model('cart',cartSchema);

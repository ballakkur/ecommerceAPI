const mongoose = require('mongoose');
const eSchema = new mongoose.Schema({
    id:{
        type:String,
        unique:true
    },
    name:{
        type:String,
        default:''
    },
    created:{
        type:Date
    },
    category:[],
    lastUpdated:{
        type:Date
    },
    description:{
        type:String
    },
    quantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number
    },
    image:{
        type:String
    }
});
mongoose.model('ecommerce',eSchema);
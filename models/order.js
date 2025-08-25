import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderID : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    status : {
        type : String,
        default : "pending"
    },
    date : {
        type : Date,
        default : Date.now
    },
    items : [
        {
            productId : {
                type : String,
                required : true
            },
            name : {
                type : String,
                requied : true
            },
            image : {
                type : String,
                requied : true
            },
            price : {
                type : Number,
                requied : true
            },
            qty : {
                type : Number,
                requied : true
            },

        }
    ],
    notes : {
        type : String,
        default : "No additional notes"
    }
})

const Order = mongoose.model("order",orderSchema);

export default Order;
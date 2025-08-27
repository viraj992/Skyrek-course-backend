import Order from "../models/order.js";

export async function createOrder(req,res){
    
    if(req.user == null){
        res.status(401).json({ message: "Please login to create"});
        return;
    }

    const latestOrder = await Order.find().sort({ date : -1}).limit(1);
    
    let orderId = "CBC00202"

    if(latestOrder.length > 0){
        //if old orders exist  - Like "CBC0035"
        const lastOrderIdInString = latestOrder[0].orderID; //"CBC00635"
        const lastOrderIdWithoutprefix = lastOrderIdInString.replace("CBC","");//"00635"
        const lastOrderIdInteger = parseInt(lastOrderIdWithoutprefix) //635
        const newOrderIdInInteger = lastOrderIdInteger + 1 ; //636
        const newOrderIdWithoutPrefix = newOrderIdInInteger.toString().padStart(5, '0'); //00636
        orderId = "CBC"+newOrderIdWithoutPrefix; //"CBC00636"
    }

    const order = new Order({
        orderID : orderId,
        email : req.user.email,
        name : req.user.firstName + " " + req.user.lastName,
        address : req.body.phone,
        items : [],
    })

    const result = await order.save();

    res.json({
        message : "Order created Successfully",
        result: result
    })

}
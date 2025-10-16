import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req,res){
    try{
    
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

        const items = [];
        let total = 0;

        if(req.body.items !== null && Array.isArray(req.body.items)){
            for(let i = 0; i < req.body.items.length; i++){

                let item = req.body.items[i];
                let product = await Product.findOne({
                    productId: item.productId,
                });

                if(product == null){
                    res.status(400).json({ message: "Invalid product ID: " + item.productId });
                    return;
                }
                items[i] = {
                    productId: product.productId,
					name: product.name,
					image: product.images[0],
					price: product.price,
					qty: item.qty,
                }
                total += product.price * item.qty;
            }
        }

        const order = new Order({
            orderID : orderId,
            email : req.user.email,
            name : req.user.firstName + " " + req.user.lastName,
            address : req.body.address,
            phone : req.body.phone,
            items : items,
            total : total,
        })

        const result = await order.save();

        res.json({
            message : "Order created Successfully",
            result: result
        });

    } catch(error){
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
      }  

}

export async function getOrders(req,res){
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;

    if(req.user == null){
        res.status(401).json({message : "Please login to view orders" });
        return;
    }

    try{
        if(req.user.role == "admin"){
            const orderCount = await Order.countDocuments(); //how many orders at now
            const totalPages = Math.ceil(orderCount / limit);
            const orders = await Order.find().skip((page-1) *limit).limit(limit).sort({ date: -1});
            res.json({
                orders: orders,
                totalPages: totalPages,
            });
        }else{
            const orderCount = await Order.countDocuments({email: req.user.email});
            const totalPages = Math.ceil(orderCount / limit);
            const orders = await Order.find({email: req.user.email}).skip((page-1) *limit).limit(limit).sort({ date:-1});
            res.json({
                orders: orders,
                totalPages: totalPages,
            });
        }

    }catch(error){
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
}
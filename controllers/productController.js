import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req,res){
    
    if(!isAdmin(req)){
        return res.status(403).json({ message : "Access denied. Admins only."});
    }

    const product = new Product(req.body)

    try{
        const response = await product.save();

        res.json({
            message : "Product created successfully",
            product : response
        })
    }catch(error){
        console.error("Error creating product:", error);
        return res.status(500).json({message : "Failed to create product"})
    }

}

export async function getProducts(req,res){

}
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
    try{
        if(isAdmin(req)){
            const products = await Product.find();
            return res.json(products);

        }else{
            const products = await Product.find({ isAvailable: true});
            return res.json(products);
        }

    }catch(error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Failed to fetch products"});
    }
}

export async function deleteProduct(req,res){

    if(!isAdmin(req)){
        res.status(403).json({ message: "Access denied. Admins only"});
        return;
    }

    try{
        const productId = req.params.productId;

        await Product.deleteOne({
            productId : productId
        })
        res.json({ message: "Product deleted successfully"})

    }catch(error){
        console.error("Error deleting Product:", error);
        res.status(403).json({ message: "Failed to delte product"});
        return;
    }
}
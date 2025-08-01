import express from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();
productRouter.post("/", createProduct);
productRouter.get("",getProducts);

// please palace id related functions latter part
productRouter.delete("/:productId", deleteProduct);

productRouter.put("/:productId", updateProduct);

export default productRouter;
import express from "express";
import { CreateProductControllers, deleteProductControllers, deleteProductImageControllers, getAllProducts, getSingleProductControllers, getTopProductControllers, productReviewController, updateProductControllers, updateProductImageController } from "../controllers/productControllers.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router()

//    ===================== PRODUCT ROUTES =====================

// Get All Product 
router.get('/get-all', getAllProducts);
// Get Top  Product 
router.get('/top-product',getTopProductControllers);

// Get Single  Product 
router.get('/:id', getSingleProductControllers);

// Create Product 
router.post('/create', isAuth, isAdmin, singleUpload ,CreateProductControllers);

// Update Product 
router.put('/:id', isAuth, isAdmin, updateProductControllers);

// Update Product Image
router.put('/image/:id', isAuth, isAdmin,singleUpload,updateProductImageController);

// delete Product image
router.delete('/delete-image/:id', isAuth, isAdmin, deleteProductImageControllers);

// delete product 
router.delete('/delete/:id', isAuth, isAdmin, deleteProductControllers); 

// review Product & Rating
router.put('/:id/review', isAuth, productReviewController);
export default router;
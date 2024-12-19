import productModel from "../models/productModels.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

//    ===================== PRODUCT CONTROLLERS =====================

// Get All  Product
export const getAllProducts = async (req, res) => {
  const { keyword, category } = req.query;
  try {
    const products = await productModel.find({
      name: {
        $regex: keyword ? keyword : "",
        $options: "i",
      },
    });
    res.status(200).send({
      success: true,
      message: "All Products fetched successfully",
      totalProduct: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Product API ",
      error,
    });
  }
};

// GET TOP PRODUCT
export const getTopProductControllers = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).send({
      success: true,
      message: "Top 3 Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get Top Product  API",
      error,
    });
  }
};

// Get single Product
export const getSingleProductControllers = async (req, res) => {
  try {
    // get product id
    const Product = await productModel.findById(req.params.id);
    // Validation
    if (!Product) {
      return res.status(404).send({
        success: false,
        message: "Product Not found ",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product Found",
      Product,
    });
  } catch (error) {
    console.log(error);
    // Cast Error || Object Id
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id ",
      });
    }
    return res.status(500).send({
      success: false,
      message: "Error In Single Product",
      error,
    });
  }
};

// Create a product
export const CreateProductControllers = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    // Validation
    // if (!name || !description || !price || !stock) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "Please provide All fileds ",
    //   });
    // }

    // file Validation
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "please provide product images",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });
    res.status(201).send({
      success: true,
      message: "Product Create Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Create Product API",
      error,
    });
  }
};

// Update Product
export const updateProductControllers = async (req, res) => {
  try {
    // Find Product
    const product = await productModel.findById(req.params.id);
    // Validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found ",
      });
    }
    const { name, description, price, stock, category } = req.body;
    // Validation and update
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    // Cast Error || Object Id
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id ",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in Update Product API",
      error,
    });
  }
};

// updated Product & Image
export const updateProductImageController = async (req, res) => {
  try {
    // Find Product
    const product = await productModel.findById(req.params.id);
    // validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product Not found",
      });
    }
    // Check file
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "File Not Found",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save
    product.images.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Image Updated",
    });
  } catch (error) {
    console.log(error);
    // cast error || OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    return res.status(500).send({
      success: false,
      message: "Error In Product Image API",
      error,
    });
  }
};

// delete Product image
export const deleteProductImageControllers = async (req, res) => {
  try {
    // Find Product
    const product = await productModel.findById(req.params.id);

    // Validation: Check if product exists
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Extract image ID from query
    const id = req.query.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Product image ID not provided",
      });
    }

    // Check if image exists in the product's images array
    let isExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) {
        isExist = index;
      }
    });

    if (isExist < 0) {
      return res.status(404).send({
        success: false,
        message: "Image not found",
      });
    }

    // Delete image from Cloudinary
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

    // Remove image from product's images array
    product.images.splice(isExist, 1);
    await product.save();

    return res.status(200).send({
      success: true,
      message: "Product image deleted successfully",
    });
  } catch (error) {
    console.log(error);

    // Handle specific error: Invalid Object ID
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid product ID",
      });
    }

    return res.status(500).send({
      success: false,
      message: "Error deleting product image",
      error,
    });
  }
};

// Dlete Product
export const deleteProductControllers = async (req, res) => {
  try {
    // find Product
    const product = await productModel.findById(req.params.id);
    // Validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product Not found",
      });
    }
    // find and delete image cloudinary
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "Product delete Succesfully",
    });
  } catch (error) {
    console.log(error);
    // Handle specific error: Invalid Object ID
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid product ID",
      });
    }
    return res.status(500).send({
      success: false,
      message: "Error In Delete Product",
      error,
    });
  }
};

// CREATE PRODUCT REVIEW AND COMMENT
export const productReviewController = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    // find product
    const product = await productModel.findById(req.params.id);

    // check previous review
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).send({
        success: false,
        message: "Product Already Reviewed",
      });
    }
    // review Object
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    // passing review object to review array
    product.reviews.push(review);
    // number or reviews
    product.numReviews = product.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    // save
    await product.save();
    res.status(200).send({
      success: true,
      message: "Review Added",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid product ID",
      });
    }
    return res.status(500).send({
      success: false,
      message: "Error In Review Comment API",
      error,
    });
  }
};

// ======================================================

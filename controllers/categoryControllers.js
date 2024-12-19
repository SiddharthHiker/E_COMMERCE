import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModels.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    // validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Please provide category name",
      });
    }
    // Use the `category` variable to create a new document
    await categoryModel.create({ category }); // Assuming the model expects a `name` field
    res.status(201).send({
      success: true,
      message: `${category} category created successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in Create Category API",
      error,
    });
  }
};

// Get category
export const getAllCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "Categories Fetch Successfully",
      totalCategories: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Get All category",
      error,
    });
  }
};

// delete category
export const deleteCategoryController = async (req, res) => {
  try {
    // find category
    const category = await categoryModel.findById(req.params.id);
    // validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category Not Found",
      });
    }
    // find product with this category id
    const products = await productModel.find({ category: category._id });
    // update product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }
    // save
    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "Category delete successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error || Object ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    return res.status(500).send({
      success: false,
      message: "Error In Delete Category API",
      error,
    });
  }
};

// update category
export const updateCategoryController = async (req, res) => {
  try {
    // find category
    const category = await categoryModel.findById(req.params.id);
    // validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category Not Found",
      });
    }

    // get new Category
    const { updatedCategory } = req.body;

    // find product with this category id
    const products = await productModel.find({ category: category._id });
    // updated Product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory;
      await product.save();
    }
    if (updatedCategory) category.category = updatedCategory;
    // save
    await category.save();
    res.status(200).send({
      success: true,
      message: "Catgory Updated Sucessfully",
    });
  } catch (error) {
    console.log(error);
    // cast error || object id
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    return res.status(500).send({
      success: false,
      message: "Error in Updated Category API",
      error,
    });
  }
};

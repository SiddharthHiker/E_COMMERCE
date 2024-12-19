import { error } from "console";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModels.js";
import { stripe } from "../server.js";

export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;

    // Create the order
    const order = await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    // Stock Update
    for (let i = 0; i < orderItems.length; i++) {
      // Find product
      const product = await productModel.findById(orderItems[i].product);

      if (!product) {
        return res.status(404).send({
          success: false,
          message: `Product with ID ${orderItems[i].product} not found`,
        });
      }

      // Update stock
      if (product.stock < orderItems[i].quantity) {
        return res.status(400).send({
          success: false,
          message: `Insufficient stock for product: ${product.name}`,
        });
      }

      product.stock -= orderItems[i].quantity;
      await product.save();
    }

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in Create Order API",
      error,
    });
  }
};

// GET All Order - My order
export const getMyOrdersController = async (req, res) => {
  try {
    // find Order
    const orders = await orderModel.find({ user: req.user._id });
    // validation
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: " No Order found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Your Order Data",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({});
  }
};
// get single Order
export const singleOrderDetailsControllers = async (req, res) => {
  try {
    // find order
    const order = await orderModel.findById(req.params.id);
    // validation
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "No Order Found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Your Order Fetch",
      order,
    });
  } catch (error) {
    console.log(error);
    // cast error || Onject Id
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in Get Order  API",
      error,
    });
  }
};
// Accept Payment
export const paymentsController = async (req, res) => {
  try {
    // Get Amount
    const { totalAmount } = req.body;

    // Validation: Check if amount is provided
    if (!totalAmount) {
      return res.status(400).send({
        success: false,
        message: "Total Amount is required",
      });
    }

    // Validation: Ensure amount is at least ₹50
    if (Number(totalAmount) < 50) {
      return res.status(400).send({
        success: false,
        message: "Amount must be at least ₹50",
      });
    }

    // Create payment intent
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount) * 100, // Convert to smallest unit (paise)
      currency: "inr",
    });

    res.status(200).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in Payment API",
    });
  }
};

// =================== ADMIN Section =======================

// Get ALL Order
export const getAllOrdersController = async (req, res) => {
  try {
    // find order
    const orders = await orderModel.find({});
    res.status(200).send({
      success: true,
      message: "All Order Data",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get All order API",
      error,
    });
  }
};

export const changeOrderStatusController = async (req, res) => {
  try {
    // Find Order
    const orders = await orderModel.findById(req.params.id);
    // validation
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "Order Not Found",
      });
    }
    if (orders.orderStatus === "processing") orders.orderStatus = "shipped";
    else if (orders.orderStatus === "shipped") {
      orders.orderStatus = "deliverd";
      orders.deliverdAt = Date.now();
    } else {
      return res.status(500).send({
        success: false,
        message: "Order Already deliverd",
      });
    }
    await orders.save();
    res.status(200).send({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    console.log(error);
    // Cast error || Object Id
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In OrderStatus API",
      error,
    });
  }
};

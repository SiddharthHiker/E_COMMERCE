import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "address is required"],
      },
      city: {
        type: String,
        required: [true, "city name is required"],
      },
      country: {
        type: String,
        required: [true, "country is required"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, " product name is required"],
        },
        price: {
          type: Number,
          required: [true, " product Price is required"],
        },
        quantity: {
          type: Number,
          required: [true, " product quantity  is required"],
        },
        image: {
          type: String,
          required: [true, "product image is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
    },
    paidAt: Date,
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "Item Price is required"],
    },
    tax: {
      type: Number,
      required: [true, "tax Price is required"],
    },
    shippingCharges: {
      type: Number,
      required: [true, " item shippingCharges  is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, " item totalAmount price  is required"],
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "deliverd"],
      default: "processing",
    },
    deliverdAt: Date,
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("Orders", orderSchema);
export default orderModel;

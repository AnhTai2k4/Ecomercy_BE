const express = require("express");
const model = require("../models/ProductModel");

const createProduct = async (product) => {
  try {
    const newProduct = await model.create(product);
    return {
      success: true,
      data: newProduct,
    };
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
  }
};

const getAllProduct = async (page = 1, limit = 5, sort, order, filter = []) => {
  try {
    let products;

    // filter
    if (Array.isArray(filter) && filter.length === 2) {
      const [label, value] = filter;
      products = await model
        .find({ [label]: { $regex: value, $options: "i" } }) // thêm $options: "i" để không phân biệt hoa thường
        .skip((page - 1) * limit)
        .limit(limit);
    }

    // sort
    if (sort) {
      products = await model
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sort]: order === "desc" ? -1 : 1 });
    }

    // default: nếu không filter, không sort
    if (!products) {
      products = await model
        .find()
        .skip((page - 1) * limit)
        .limit(limit);
    }

    const totalProduct = await model.countDocuments();

    return {
      success: true,
      data: products,
      totalPage: Math.ceil(totalProduct / limit),
      currentPage: page,
    };
  } catch (e) {
    return {
      success: false,
      message: "Lấy tất cả sản phẩm thất bại: " + e.message,
    };
  }
};


const getProduct = async (id) => {
  try {
    const products = await model.findOne({ _id: id });
    return {
      success: true,
      data: products,
    };
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
  }
};

const updateProduct = async (id, product) => {
  try {
    const updatedProduct = await model.findByIdAndUpdate(id, product, {
      new: true,
    });
    return {
      success: true,
      data: updatedProduct,
    };
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
  }
};

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await model.findByIdAndDelete(id);
    return {
      success: true,
      data: deletedProduct,
    };
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};

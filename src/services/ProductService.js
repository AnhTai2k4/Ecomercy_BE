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

const getAllProduct = async (page = 1, limit = 5, sort, order, filter) => {
  try {
    let products;
    const field = filter[0];
    const value = filter[1];

    if (filter) {
      const label = filter[0];
      const value  = filter[1];
      products = await model
        .find({ [label]: {'$regex': value} })
        .skip((page - 1) * limit)
        .limit(limit);
    }

    if (sort) {
      products = await model
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sort]: order });
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
      message: e.message,
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

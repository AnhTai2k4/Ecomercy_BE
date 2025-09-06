const express = require("express");
const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  const product = req.body;
  console.log("product ne", product);

  const result = await ProductService.createProduct(product);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Create product thất bại: " + result.message,
    });
  }
  return res.status(201).json({
    success: true,
    message: "Create product thành công",
    data: result.data,
  });
};

const getAllProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const sort = req.query.sort ; // Mặc định sắp xếp theo createdAt
  const order = req.query.order === 'desc' ? -1 : 1; // Mặc định là tăng dần (asc)
  const filter = req.query.filter ; // Lọc theo loại sản phẩm (type)
  const result = await ProductService.getAllProduct(page, limit, sort,order,filter);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Lấy tất cả sản phẩm thất bại: " + result.message,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Lấy tất cả sản phẩm thành công",
    data: result.data,
    totalPage : result.totalPage,
    currentPage : result.currentPage,
  });
};

const getProduct = async (req, res) => {
  const id = req.params.id;
  const result = await ProductService.getProduct(id);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Lấy sản phẩm thất bại: " + result.message,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Lấy sản phẩm thành công",
    data: result.data,
  });
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const product = req.body;
  const result = await ProductService.updateProduct(id, product);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Cập nhật sản phẩm thất bại: " + result.message,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Cập nhật sản phẩm thành công",
    data: result.data,
  });
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const result = await ProductService.deleteProduct(id);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Xoá sản phẩm thất bại: " + result.message,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Xoá sản phẩm thành công",
    data: result.data,
  });
};
module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};

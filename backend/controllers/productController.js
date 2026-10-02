import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

const addProduct = async (req, res, next) => {

  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined ); 

    let imagesURL = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price), 
      subCategory,
      bestseller: bestseller === "true" ? true : false, 
      sizes: JSON.parse(sizes),
      image: imagesURL,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();
    res.status(201).json({ success: true, message: "Product Added" });

  } catch (error) { next(error) }
};

// ----- Total Product List -----
const listProducts = async (req, res, next) => {
    try {
      const products = await productModel.find({});
      res.status(200).json({ success: true, products })
  
    } catch (error) { next(error) }
};

const removeProduct = async (req, res, next) => {
    try{
      const product = await productModel.findById(req.body.id)

      if(!product) {
        return res.status(404).json({ success: false, message: "Product not found" })
      }

      await productModel.findByIdAndDelete(req.body.id)
      res.status(200).json({ success: true, message: "Product Removed" })

    } catch (error) { next(error) }

};

// ----- GET single product details -----
const singleProduct = async (req, res, next) => {

    try {
        const { productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ success: false, message: 'Invalid product ID' })
        }

        const product = await productModel.findById(productId)

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        res.status(200).json({ success: true, product })

    } catch (error) { next(error) }

};

// ----- EDIT PRODUCTS in ADMIN -----
const editProduct = async (req, res, next) => {
  try {
    const {id, name, description, price, category, subCategory, sizes, bestseller} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' })
    }
    
    const product = await productModel.findById(id)

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const newImages = [image1, image2, image3, image4]
    const existingImages = product.image; 

    const editedImages = await Promise.all(
      newImages.map(async (file, index) => {
        if (file) {
          const result = await cloudinary.uploader.upload(file.path, {resource_type: 'image'});
          return result.secure_url;
        }
        return existingImages[index] || null;   
      })
    )

    const finalImages = editedImages.filter(Boolean);
    await productModel.findByIdAndUpdate(id, {
      name,
      description,
      category,
      price: Number(price), 
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: finalImages,
    })

    res.status(200).json({ success: true, message: 'Product Updated' });

  } catch (error) { next(error) }
}

export { addProduct, listProducts, removeProduct, singleProduct, editProduct };


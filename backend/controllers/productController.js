// Here we'll create 4 controller functions

import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

// ----- ADD Product -----

const addProduct = async (req, res, next) => {
  // to add a product we'll create a middleware using MULTER, so if we send any file as form data then that file will be parsed using MULTER

  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // we have to store these images in the DB, but in the DB we can't store the image, so first we have to store these images in Cloudinary. From Cloudinary we take the URL and save it in our DB

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined ); //images sent from admin pannel

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
      price: Number(price), // it comes as string so it needs to be converted into number
      subCategory,
      bestseller: bestseller === "true" ? true : false, // it comes as string so we neet to change it into boolean
      sizes: JSON.parse(sizes), // from frontend it comes as string, so we need to convert it into an array
      image: imagesURL,
      date: Date.now(),
    };

    // in order to add the product, we need to use ProductModel from productModel.js
    const product = new productModel(productData);
    await product.save();

    // 201 Created — produs nou adăugat cu succes
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

// ----- REMOVE Product -----

const removeProduct = async (req, res, next) => {
    try{
      const product = await productModel.findById(req.body.id)

      if(!product) {
        // 404 Not Found — produsul nu există în baza de date
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
            // 404 Not Found — produsul cerut nu există
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        res.status(200).json({ success: true, product })

    } catch (error) { next(error) }

};

// EDIT PRODUCTS in ADMIN
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

    // Handle new images (only replace slots where a new file was uploaded)
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const newImages = [image1, image2, image3, image4]

    // For each slot: if a new file was uploaded → upload to Cloudinary; otherwise keep the existing URL
    const existingImages = product.image;   // e.g. ['url1', 'url2', ...]
    const editedImages = await Promise.all(
      newImages.map(async (file, index) => {
        if (file) {
          const result = await cloudinary.uploader.upload(file.path, {resource_type: 'image'});
          return result.secure_url;
        }
        return existingImages[index] || null;   // keep old or null if slot didn't exist
      })
    )

    const finalImages = editedImages.filter(Boolean);    // elimină orice valoare falsy din array (null, undefined, false, "").
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

// using these functions wețll create the route

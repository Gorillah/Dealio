"use server";

import { revalidatePath } from "next/cache";
import Product from "./models/product.model";
import { connectDB } from "./mongoose";
import { scrapeAmazonProduct } from "./scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "./utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "./nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  connectDB();
  if (!productUrl) return;
  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      {
        url: scrapedProduct.url,
      },
      product,
      {
        upsert: true,
        new: true,
      }
    );
    revalidatePath(`/products/${newProduct?._id}`);
  } catch (error: any) {
    console.log(error);
    // throw new Error("Failed to scrape and store product", error.message);
  }
}

export async function getProductById(getProductById: string) {
  try {
    connectDB();
    const product = await Product.findById(getProductById);
    if (!product) return null;
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectDB();
    const products = await Product.find();
    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectDB();
    const products = await Product.findById(productId);
    if (!products) return null;
    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    connectDB();
    const product = await Product.findById(productId);
    if (!product) return null;
    const userExist = product.users.some((user: User) => {
      user.email === userEmail;
    });
    if (!userEmail) product.users.push({ email: userEmail });
    await product.save();
    const emailContent = await generateEmailBody(product, "WELCOME");
    await sendEmail(emailContent, [userEmail]);
    await product.save();
  } catch (error) {
    console.log(error);
  }
}

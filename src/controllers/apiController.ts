import { RequestHandler } from "express";
import { z } from "zod";
import { database } from "../database";
import { fakeStoreRequest } from "../fakeStore";

type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  rating?: { rate: number; count: number };
};

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(5000),
  productId: z.number().int().positive().optional()
});

export const login: RequestHandler = async (request, response, next) => {
  try {
    const body = z.object({
      username: z.string().min(1),
      password: z.string().min(1)
    }).parse(request.body);
    const result = await fakeStoreRequest<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body)
    });
    response.json(result);
  } catch (error) {
    next(error);
  }
};

export const listProducts: RequestHandler = async (request, response, next) => {
  try {
    const query = new URLSearchParams();
    for (const key of ["limit", "sort"]) {
      const value = request.query[key];
      if (typeof value === "string") query.set(key, value);
    }
    const suffix = query.size ? `?${query.toString()}` : "";
    const products = await fakeStoreRequest<Product[]>(`/products${suffix}`);
    response.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductDetails: RequestHandler = async (request, response, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(request.params.id);
    const product = await fakeStoreRequest<Product>(`/products/${id}`);
    response.json(product);
  } catch (error) {
    next(error);
  }
};

export const listCategories: RequestHandler = async (_request, response, next) => {
  try {
    const categories = await fakeStoreRequest<string[]>("/products/categories");
    response.json(categories);
  } catch (error) {
    next(error);
  }
};

export const listProductsByCategory: RequestHandler = async (request, response, next) => {
  try {
    const category = encodeURIComponent(z.string().parse(request.params.category));
    const products = await fakeStoreRequest<Product[]>(`/products/category/${category}`);
    response.json(products);
  } catch (error) {
    next(error);
  }
};

export const searchProducts: RequestHandler = async (request, response, next) => {
  try {
    const term = z.string().trim().min(1).parse(request.query.q).toLocaleLowerCase();
    const products = await fakeStoreRequest<Product[]>("/products");
    response.json(products.filter((product) =>
      `${product.title} ${product.description} ${product.category}`.toLocaleLowerCase().includes(term)
    ));
  } catch (error) {
    next(error);
  }
};

export const submitEnquiry: RequestHandler = (request, response, next) => {
  try {
    const enquiry = enquirySchema.parse(request.body);
    const result = database.prepare(`
      INSERT INTO enquiries (name, email, message, product_id)
      VALUES (@name, @email, @message, @productId)
    `).run({
      name: enquiry.name,
      email: enquiry.email,
      message: enquiry.message,
      productId: enquiry.productId ?? null
    });

    response.status(201).json({ id: Number(result.lastInsertRowid), status: "submitted" });
  } catch (error) {
    next(error);
  }
};

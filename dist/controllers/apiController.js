"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitEnquiry = exports.searchProducts = exports.listProductsByCategory = exports.listCategories = exports.getProductDetails = exports.listProducts = exports.login = void 0;
const zod_1 = require("zod");
const database_1 = require("../database");
const fakeStore_1 = require("../fakeStore");
const enquirySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(120),
    email: zod_1.z.string().trim().email().max(254),
    message: zod_1.z.string().trim().min(1).max(5000),
    productId: zod_1.z.number().int().positive().optional()
});
const login = async (request, response, next) => {
    try {
        const body = zod_1.z.object({
            username: zod_1.z.string().min(1),
            password: zod_1.z.string().min(1)
        }).parse(request.body);
        const result = await (0, fakeStore_1.fakeStoreRequest)("/auth/login", {
            method: "POST",
            body: JSON.stringify(body)
        });
        response.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const listProducts = async (request, response, next) => {
    try {
        const query = new URLSearchParams();
        for (const key of ["limit", "sort"]) {
            const value = request.query[key];
            if (typeof value === "string")
                query.set(key, value);
        }
        const suffix = query.size ? `?${query.toString()}` : "";
        const products = await (0, fakeStore_1.fakeStoreRequest)(`/products${suffix}`);
        response.json(products);
    }
    catch (error) {
        next(error);
    }
};
exports.listProducts = listProducts;
const getProductDetails = async (request, response, next) => {
    try {
        const id = zod_1.z.coerce.number().int().positive().parse(request.params.id);
        const product = await (0, fakeStore_1.fakeStoreRequest)(`/products/${id}`);
        response.json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.getProductDetails = getProductDetails;
const listCategories = async (_request, response, next) => {
    try {
        const categories = await (0, fakeStore_1.fakeStoreRequest)("/products/categories");
        response.json(categories);
    }
    catch (error) {
        next(error);
    }
};
exports.listCategories = listCategories;
const listProductsByCategory = async (request, response, next) => {
    try {
        const category = encodeURIComponent(zod_1.z.string().parse(request.params.category));
        const products = await (0, fakeStore_1.fakeStoreRequest)(`/products/category/${category}`);
        response.json(products);
    }
    catch (error) {
        next(error);
    }
};
exports.listProductsByCategory = listProductsByCategory;
const searchProducts = async (request, response, next) => {
    try {
        const term = zod_1.z.string().trim().min(1).parse(request.query.q).toLocaleLowerCase();
        const products = await (0, fakeStore_1.fakeStoreRequest)("/products");
        response.json(products.filter((product) => `${product.title} ${product.description} ${product.category}`.toLocaleLowerCase().includes(term)));
    }
    catch (error) {
        next(error);
    }
};
exports.searchProducts = searchProducts;
const submitEnquiry = (request, response, next) => {
    try {
        const enquiry = enquirySchema.parse(request.body);
        const result = database_1.database.prepare(`
      INSERT INTO enquiries (name, email, message, product_id)
      VALUES (@name, @email, @message, @productId)
    `).run({
            name: enquiry.name,
            email: enquiry.email,
            message: enquiry.message,
            productId: enquiry.productId ?? null
        });
        response.status(201).json({ id: Number(result.lastInsertRowid), status: "submitted" });
    }
    catch (error) {
        next(error);
    }
};
exports.submitEnquiry = submitEnquiry;

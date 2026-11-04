import { Router } from "express";
import {
  getProductDetails,
  listCategories,
  listProducts,
  listProductsByCategory,
  login,
  searchProducts,
  submitEnquiry
} from "../controllers/apiController";

const apiRouter = Router();

apiRouter.post("/auth/login", login);
apiRouter.get("/products", listProducts);
apiRouter.get("/products/search", searchProducts);
apiRouter.get("/categories", listCategories);
apiRouter.get("/products/categories", listCategories);
apiRouter.get("/products/category/:category", listProductsByCategory);
apiRouter.get("/products/:id", getProductDetails);
apiRouter.post("/enquiries", submitEnquiry);

export { apiRouter };

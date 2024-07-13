import { Request, Response } from "express";
import { ProductService } from "../../domains/services/productService";

const productService = new ProductService();

export const addProduct = async (req: Request, res: Response) => {
  const { name, price, stock, imageUrl } = req.body;
  try {
    const product = await productService.createProduct(
      name,
      price,
      stock,
      imageUrl
    );
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error adding product" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await productService.deleteProduct(Number(id));
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, stock, imageUrl } = req.body;
  try {
    const product = await productService.editProduct(
      Number(id),
      name,
      price,
      stock,
      imageUrl
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error editing product" });
  }
};

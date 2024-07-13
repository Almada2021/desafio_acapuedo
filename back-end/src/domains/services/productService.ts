import prisma from "../../infrastructure/prismaClient";

export class ProductService {
  async createProduct(name: string, price: number, stock: number, imageUrl?: string) {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        stock,
        imageUrl,
      },
    });
    return product;
  }

  async getAllProducts() {
    const products = await prisma.product.findMany();
    return products;
  }

  async deleteProduct(id: number) {
    const product = await prisma.product.delete({
      where: { id },
    });
    return product;
  }

  async editProduct(id: number, name: string, price: number, stock: number, imageUrl?: string) {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        stock,
        imageUrl,
      },
    });
    return product;
  }
}
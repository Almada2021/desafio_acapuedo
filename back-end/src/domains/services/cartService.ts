import prisma from "../../infrastructure/prismaClient";
export class CartService {
    async getCartByDebtId(debtId: number) {
        const carts = await prisma.cart.findMany({
          where: { debtId },
        });
    
        if (!carts || carts.length === 0) {
          throw new Error("Cart not found");
        }
    
        const cartProducts = await Promise.all(
          carts.map(async (cart) => {
            const products = await prisma.product.findMany({
              where: {
                id: {
                  in: cart.productIds,
                },
              },
            });
    
            return {
              products: products.map((product, index) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                imageUrl: product.imageUrl,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                quantity: cart.quantities[index],
              })),
            };
          })
        );
        return cartProducts;
      }
    
  async getCartByUserId(userId: number) {
    return await prisma.cart.findMany({
      where: { userId },
    });
  }

  async getAllCarts() {
    return await prisma.cart.findMany();
  }
}

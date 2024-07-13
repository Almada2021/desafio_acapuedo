import { CartService } from "../../domains/services/cartService";

export class CartController {
  // Implement cart related operations here
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
    this.getCartByDebtId = this.getCartByDebtId.bind(this); // Enlazar el método
  }

  async getCartByDebtId(req: any, res: any) {
    const debtId = Number(req.params.debtId);
    const cart = await this.cartService.getCartByDebtId(debtId);
    res.json(cart[0]);
  }
}
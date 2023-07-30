import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";
import { IProduct } from "../../contexts/CartContext";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { products } = req.body as { products: IProduct[] };

  if (!products) {
    return res.status(400).json({ error: "Products not found." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not aloowed." });
  }

  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_URL}/`;

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    mode: "payment",
    line_items: products.map(product => {
      return {
        price: product.defaultPriceId,
        quantity: 1
      }
    })
  });

  return res.status(201).json({
    checkoutUrl: checkoutSession.url,
  });
}

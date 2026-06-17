import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(120),
  phone: z
    .string()
    .min(8, "Valid phone required")
    .max(20)
    .regex(/^[0-9+\s-]+$/, "Invalid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Full shipping address required").max(500),
  note: z.string().max(500).optional().or(z.literal("")),
  paymentMethod: z.enum(["COD", "BANK_QR", "CARD_CONTACT"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, "Cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  priceVnd: z.number().int().min(0).max(1_000_000_000),
  imageUrl: z.string().url(),
  stock: z.number().int().min(0).max(100000),
  active: z.boolean(),
  category: z.string().max(60).nullable().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

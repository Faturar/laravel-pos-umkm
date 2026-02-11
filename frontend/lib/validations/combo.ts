import { z } from "zod"

export const comboFormSchema = z.object({
  name: z
    .string()
    .min(1, "Combo name is required")
    .max(255, "Combo name must be less than 255 characters"),
  price: z.number().min(0, "Price must be at least 0"),
  is_active: z.boolean().default(true),
  outlet_id: z.number().optional(),
  items: z
    .array(
      z.object({
        product_id: z.number().min(1, "Product is required"),
        variant_id: z.number().optional(),
        qty: z.number().min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "Combo must have at least 1 item"),
})

export type ComboFormSchema = z.infer<typeof comboFormSchema>

import { z } from "zod"

export const productFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Product name is required")
      .max(255, "Product name must not exceed 255 characters"),
    description: z
      .string()
      .max(500, "Description must not exceed 500 characters")
      .optional()
      .nullable(),
    price: z.number().min(0, "Price must be greater than or equal to 0"),
    cost: z
      .number()
      .min(0, "Cost must be greater than or equal to 0")
      .optional()
      .nullable(),
    sku: z
      .string()
      .max(50, "SKU must not exceed 50 characters")
      .optional()
      .nullable(),
    barcode: z
      .string()
      .max(50, "Barcode must not exceed 50 characters")
      .optional()
      .nullable(),
    image: z
      .string()
      .max(255, "Image URL must not exceed 255 characters")
      .optional()
      .nullable(),
    is_active: z.boolean().default(true),
    track_stock: z.boolean().default(true),
    stock_quantity: z
      .number()
      .min(0, "Stock quantity must be greater than or equal to 0"),
    stock_alert_threshold: z
      .number()
      .min(0, "Stock alert threshold must be greater than or equal to 0"),
    category_id: z.number().min(1, "Category is required"),
    outlet_id: z.number().min(1, "Outlet is required"),
  })
  .refine(
    (data) => {
      // If track_stock is true, then stock_quantity and stock_alert_threshold are required
      if (data.track_stock) {
        return (
          data.stock_quantity !== undefined &&
          data.stock_alert_threshold !== undefined
        )
      }
      return true
    },
    {
      message:
        "Stock quantity and alert threshold are required when track stock is enabled",
      path: ["track_stock"],
    },
  )

export type ProductFormData = z.infer<typeof productFormSchema>

import { z } from "zod"

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
})

// Export the inferred type
export type LoginFormData = z.infer<typeof loginSchema>

// Product form validation schema
export const productSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Product name is required" })
    .max(255, { message: "Product name must be less than 255 characters" }),
  sku: z
    .string()
    .min(1, { message: "SKU is required" })
    .max(100, { message: "SKU must be less than 100 characters" }),
  barcode: z
    .string()
    .max(100, { message: "Barcode must be less than 100 characters" })
    .optional(),
  description: z
    .string()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .optional(),
  category_id: z.number().min(1, { message: "Category is required" }),
  outlet_id: z.number().min(1, { message: "Outlet is required" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  cost: z.number().min(0, { message: "Cost must be a positive number" }),
  stock: z.number().min(0, { message: "Stock must be a positive number" }),
  min_stock: z
    .number()
    .min(0, { message: "Minimum stock must be a positive number" }),
  unit: z
    .string()
    .min(1, { message: "Unit is required" })
    .max(50, { message: "Unit must be less than 50 characters" }),
  is_active: z.boolean().default(true),
  has_variants: z.boolean().default(false),
})

// Export the inferred type
export type ProductFormData = z.infer<typeof productSchema>

// Category form validation schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required" })
    .max(255, { message: "Category name must be less than 255 characters" }),
  description: z
    .string()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .optional(),
})

// Export the inferred type
export type CategoryFormData = z.infer<typeof categorySchema>

// Outlet form validation schema
export const outletSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Outlet name is required" })
    .max(255, { message: "Outlet name must be less than 255 characters" }),
  address: z
    .string()
    .max(500, { message: "Address must be less than 500 characters" })
    .optional(),
  phone: z
    .string()
    .max(20, { message: "Phone must be less than 20 characters" })
    .optional(),
})

// Export the inferred type
export type OutletFormData = z.infer<typeof outletSchema>

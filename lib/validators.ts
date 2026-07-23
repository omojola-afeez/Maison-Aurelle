import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  line1: z.string().min(3, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "Valid ZIP code is required"),
  country: z.string().default("US"),
  isDefault: z.boolean().default(false),
  type: z.enum(["shipping", "billing"]).default("shipping"),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100).optional(),
  content: z.string().min(10, "Review must be at least 10 characters").max(2000),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const checkoutSchema = z.object({
  email: z.string().email("Valid email is required"),
  shippingName: z.string().min(2, "Name is required"),
  shippingAddress: z.string().min(3, "Address is required"),
  shippingCity: z.string().min(2, "City is required"),
  shippingState: z.string().min(2, "State is required"),
  shippingZip: z.string().min(5, "Valid ZIP is required"),
  shippingCountry: z.string().default("US"),
  billingSameAsShipping: z.boolean().default(true),
  billingName: z.string().optional(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZip: z.string().optional(),
  billingCountry: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CouponInput = z.infer<typeof couponSchema>;

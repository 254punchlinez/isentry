import * as yup from "yup"

// User validation schema
export const userSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
  email: yup.string().required("Email is required").email("Please enter a valid email address"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[\d\s\-$$$$+.]+$/, "Please enter a valid phone number"),
  website: yup.string().required("Website is required").url("Please enter a valid URL"),
  address: yup.object({
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    zipcode: yup.string().required("Zipcode is required"),
  }),
  company: yup.object({
    name: yup.string().required("Company name is required"),
  }),
})

// Post validation schema
export const postSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  body: yup
    .string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content must be less than 1000 characters"),
  userId: yup
    .number()
    .required("User ID is required")
    .positive("User ID must be a positive number")
    .integer("User ID must be an integer"),
})

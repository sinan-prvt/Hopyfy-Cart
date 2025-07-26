import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: "",
    description: "",
    price: "",
    count: "",
    category: "",
    images: [""],
    isActive: true,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().min(0, "Price must be >= 0").required("Price is required"),
    count: Yup.number().min(0, "Stock count must be >= 0").required("Count is required"),
    category: Yup.string().required("Category is required"),
    images: Yup.array().of(Yup.string().url("Must be a valid URL").required("Image URL is required")),
    isActive: Yup.boolean(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const product = {
        ...values,
        created_at: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would use:
      // await axios.post("http://localhost:3000/products", product);
      
      resetForm();
      navigate("/admin/products");
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Beauty",
    "Sports",
    "Toys",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Add New Product</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Fill out the form below to add a new product to your inventory
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center">
              <button 
                onClick={() => navigate("/admin/products")}
                className="flex items-center mr-4 text-blue-200 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <h2 className="text-xl font-bold">Product Information</h2>
            </div>
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="name"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.name && touched.name
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 transition-colors`}
                        placeholder="Enter product name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="description"
                        as="textarea"
                        rows="4"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.description && touched.description
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 transition-colors`}
                        placeholder="Enter detailed product description..."
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        name="category"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.category && touched.category
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 transition-colors`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">₹</span>
                          </div>
                          <Field
                            name="price"
                            type="number"
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                              errors.price && touched.price
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            } focus:outline-none focus:ring-2 transition-colors`}
                            placeholder="0.00"
                          />
                        </div>
                        <ErrorMessage
                          name="price"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Count <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="count"
                          type="number"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.count && touched.count
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 transition-colors`}
                          placeholder="Enter quantity"
                        />
                        <ErrorMessage
                          name="count"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Images <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        {values.images.map((img, index) => (
                          <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1">
                              <Field
                                name={`images[${index}]`}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                  errors.images?.[index] && touched.images?.[index]
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                } focus:outline-none focus:ring-2 transition-colors`}
                                placeholder="https://example.com/image.jpg"
                              />
                              {errors.images?.[index] && (
                                <div className="text-red-500 text-sm mt-1">
                                  {errors.images[index]}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const imgs = [...values.images];
                                imgs.splice(index, 1);
                                setFieldValue("images", imgs);
                              }}
                              className="mt-3 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              disabled={values.images.length <= 1}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => setFieldValue("images", [...values.images, ""])}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium mt-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Add another image
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <Field
                            name="isActive"
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label className="font-medium text-gray-700">
                            Active Product
                          </label>
                          <p className="text-gray-500">
                            Product will be visible to customers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Image Preview */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Image Previews</h3>
                  <div className="flex flex-wrap gap-4">
                    {values.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <div
                          className={`relative border-2 rounded-xl overflow-hidden w-32 h-32 bg-gray-100 ${
                            errors.images?.[index] ? "border-red-200" : "border-gray-200"
                          }`}
                        >
                          {img ? (
                            <img
                              src={img}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="text-center text-xs mt-1 text-gray-500 truncate w-32">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Submit Area */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                  {submitError && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{submitError}</span>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Product...
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>© 2023 Product Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
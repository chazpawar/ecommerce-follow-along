import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(1);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch product data if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
          const productData = response.data.product;
          setProduct(productData);
          setProductName(productData.name);
          setDescription(productData.description);
          setPrice(productData.price);
          setCategory(productData.category);
        } catch (error) {
          console.error('Error fetching product:', error);
          setError('Failed to fetch product details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size and type
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} is not an image`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 5) {
      setError('You can only upload up to 5 images');
      return;
    }

    setImages(validFiles);
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
    setError(""); // Clear any previous errors
  };

  const validateForm = () => {
    if (!productName || !description || !price || !category) {
      setError("Please fill in all required fields");
      return false;
    }
    
    if (productName.length < 3) {
      setError("Product name must be at least 3 characters long");
      return false;
    }
    
    if (description.length < 10) {
      setError("Description must be at least 10 characters long");
      return false;
    }
    
    if (parseFloat(price) <= 0) {
      setError("Price must be greater than 0");
      return false;
    }
    
    // Only require images for new products
    if (!product && images.length === 0) {
      setError("Please upload at least one image");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError("");
      
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('stock', stock);
      formData.append('userEmail', localStorage.getItem('userEmail'));
      
      // Append each image to formData
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000 // 10 second timeout
      };

      let response;
      if (product) {
        // Update existing product
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/products/update/${product._id}`,
          formData,
          config
        );
        setSuccessMessage("Product updated successfully!");
      } else {
        // Create new product
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/products/create`,
          formData,
          config
        );
        setSuccessMessage("Product created successfully!");
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Operation failed');
      }

      // Show success message and redirect
      setTimeout(() => {
        navigate('/my-products');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'An error occurred. Please try again.'
      );
      
      // Scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {product ? 'Edit Product' : 'Create Product'}
            </h1>
            <p className="text-gray-600">
              {product ? 'Update your product details below' : 'Enter your product details below'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name*
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
                minLength={3}
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description*
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-32"
                required
                minLength={10}
                maxLength={1000}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price* ($)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
                min="0.01"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock*
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
                min="1"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category*
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              >
                <option value="">Select a category</option>
                <option value="bedroom">Bedroom</option>
                <option value="livingroom">Living Room</option>
                <option value="kitchen">Kitchen</option>
                <option value="bathroom">Bathroom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images* (Up to 5)
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <p className="mt-1 text-sm text-gray-500">
                Maximum 5 images, 5MB each. Supported formats: JPG, PNG, WebP
              </p>

              {/* Preview Images */}
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">New Images:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {previewImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Images */}
              {product?.images?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {product.images.map((image, index) => (
                      <img
                        key={`existing-${index}`}
                        src={`${import.meta.env.VITE_API_URL}${image}`}
                        alt={`Product ${index + 1}`}
                        className="h-32 w-full object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {product ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                product ? 'Update Product' : 'Create Product'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side image section */}
      <div className="hidden md:block md:w-1/2">
        <div className="h-full w-full bg-cover bg-center relative">
          <img 
            src="https://www.home-designing.com/wp-content/uploads/2016/02/minimalistic-decor-ideas.jpg"
            alt="Product Showcase"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center p-12 relative z-10">
            <div className="text-white text-center">
              <h2 className="text-4xl font-bold mb-4">Create Amazing Products</h2>
              <p className="text-lg text-gray-200">
                Share your products with the world
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
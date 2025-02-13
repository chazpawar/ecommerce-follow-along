import React, { useState, useRef, useEffect } from "react";

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    if (showForm && formRef.current) {
      const handleMouseMove = (e) => {
        const form = formRef.current;
        const rect = form.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        form.style.transform = `perspective(1000px) rotateX(${offsetY / 50}deg) rotateY(${offsetX / 50}deg)`;
      };

      const handleMouseLeave = () => {
        formRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      };

      const form = formRef.current;
      form.addEventListener("mousemove", handleMouseMove);
      form.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        form.removeEventListener("mousemove", handleMouseMove);
        form.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [showForm]);

  useEffect(() => {
    return () => {
      // Revoke object URLs to avoid memory leaks
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const validateForm = () => {
    if (!productName || !description || !price || !category) {
      setToastMessage("Please fill in all fields.");
      return false;
    }
    if (images.length === 0) {
      setToastMessage("Please upload at least one image.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setTimeout(() => {
      setToastMessage("Product created successfully!");
      setShowForm(false);
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setProductName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImages([]);
    setPreviewImages([]);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div
            ref={formRef}
            className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl sm:max-w-full transform transition-all duration-300 ease-out"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Upload Product Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {previewImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {previewImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:shadow-3xl transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50"
      >
        + Create Product
      </button>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white py-3 px-6 rounded-lg shadow-2xl z-50 transition-opacity duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ProductForm;

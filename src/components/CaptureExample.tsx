import React, { useState } from "react";
import WebcamCapture from "./Capture";

// Example usage of the WebcamCapture component
const CaptureExample: React.FC = () => {
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: null as File | null,
  });

  const handleImageCapture = (event: any) => {
    const file = event.target.value;
    setCapturedFile(file);
    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.photo) {
      // console.log('Form submitted with photo:', {
      //   name: formData.name,
      //   email: formData.email,
      //   photo: formData.photo
      // });

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("photo", formData.photo);

      // Send to your API
      // console.log('Ready to submit FormData');
    } else {
      alert("Please capture a photo first");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Webcam Capture Example
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <WebcamCapture
            name="photo"
            onChange={handleImageCapture}
            placeholder="Click to capture your photo"
            required={true}
            quality={0.9}
            width={1280}
            height={720}
            className="w-full"
          />
        </div>

        {capturedFile && (
          <div className="text-sm text-green-600">
            ✅ Photo captured: {capturedFile.name} (
            {Math.round(capturedFile.size / 1024)}KB)
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default CaptureExample;

import axios from "axios";

export const fetchData = async (url) => {
  const baseURL = import.meta.env.VITE_APP_URL;
  try {
    const response = await axios.get(`${baseURL}${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
    };
  }
};

export const postData = async (url, payload) => {
  const baseURL = import.meta.env.VITE_APP_URL;
  try {
    const response = await axios.post(`${baseURL}${url}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      success: true,
      data: response.data || response,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data,
      status: error.response?.status,
    };
  }
};

export const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME_NEW;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

export const updateData = async (url, payload) => {
  const baseURL = import.meta.env.VITE_APP_URL;

  try {
    const response = await axios.patch(`${baseURL}${url}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error updating data:", error);
    return {
      success: false,
      error: error,
      status: error.response?.status,
    };
  }
};

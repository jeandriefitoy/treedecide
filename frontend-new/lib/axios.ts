import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const uploadDataset = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file); 

  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data; 
  } catch (error) {
    console.error('Error uploading dataset:', error);
    throw error;
  }
};
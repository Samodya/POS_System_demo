import axios from 'axios';
const baseURL = 'http://localhost:4000/api';

const apiService = {

  
 // Create (POST)
 createData: async (collection, data, token, role) => {
  const isFormData = data instanceof FormData;

    try {
      const response = await axios.post(`${baseURL}/${collection}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Role': role,
          ...(isFormData ? {} : { "Content-Type": "application/json" })

        },
        
      });
      return response.data;
    } catch (error) {
      console.error('Error creating data:', error);
      throw error;
    }
 },

 // Read (GET)
 getData: async (collection,token) => {
    try {
      const response = await axios.get(`${baseURL}/${collection}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
 },

 getDataById: async (collection,id,token) => {
    try {
      const response = await axios.get(`${baseURL}/${collection}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
 },

 // Update (PUT)
 updateData: async (collection,id, data, token, role) => {
    try {
      const response = await axios.put(`${baseURL}/${collection}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Role': role,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
 },

 // Delete (DELETE)
 deleteData: async (collection, id, token) => {
    try {
      const response = await axios.delete(`${baseURL}/${collection}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
 },
};

export default apiService;

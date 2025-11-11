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
      const message = error.response?.data?.error || error.message || 'An unknown error occurred.';
     
      console.error('Error creating data:', message);
      // We re-throw the error so that component-level logic (like stopping a loader) can still react.
      // However, the error is already displayed to the user.
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
      const message = error.response?.data?.error || error.message || 'Failed to fetch data.';
      console.error('Error fetching data:', message);
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
      const message = error.response?.data?.error || error.message || `Failed to fetch item with id ${id}.`;
      console.error('Error fetching data by ID:', message);
      throw error; 
    }
 },

 // Update (PUT)
 updateData: async (collection,id, data, token, role) => {
  const isFormData = data instanceof FormData;

    try {
      const response = await axios.put(`${baseURL}/${collection}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Role': role,
          ...(isFormData ? {} : { "Content-Type": "application/json" })
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to update data.';
     
      console.error('Error updating data:', message);
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
      const message = error.response?.data?.error || error.message || 'Failed to delete data.';
     
      console.error('Error deleting data:', message);
      throw error; 
    }
 },
};

export default apiService;

// Make sure to export your store from your store file and import it here.
// For example, in 'client/src/app/store.js': export const store = configureStore({...});

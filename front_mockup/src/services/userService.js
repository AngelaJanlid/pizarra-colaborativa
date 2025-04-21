// src/services/userService.js
import axios from 'axios';

const API_URL = '/api/user';

export default {
  async getAllUsers() {
    const token = localStorage.getItem('token'); // Obtén el token
    //console.log('Token enviado:', token);
    
    if (!token) {
      throw new Error('No hay token disponible');
    }
   // console.log('Token usado:', localStorage.getItem('token'));
  
    try {
      const response = await axios.get('/api/user', {
        headers: {
           'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  async createUser(userData) {
    try {
      const response = await axios.post(API_URL, userData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },


  async updateUser(id, userData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

 
  async deleteUser(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};


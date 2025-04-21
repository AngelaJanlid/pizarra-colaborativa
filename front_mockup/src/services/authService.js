import axios from "axios";

const API_URL = '/api/auth';


export default {

  
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { 
        email, 
        password 
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type' : 'application/json'
        }
      });
      console.log('Respuesta completa:', response);
     
      
      if (!response.data || !response.data.user || !response.data.token) {
        throw new Error('La respuesta del Servidor es invalida');
      }

      //guardar datos en localstorage
      const token= response.data.token;
      //console.log('token guardado:',token );
      localStorage.setItem('token', token);
  
      //console.log('Token en localStorage:', localStorage.getItem('token')); 


      localStorage.setItem('user', JSON.stringify({
        id: response.data.user.id,
        email: response.data.user.email,
        role: response.data.user.role
      }));
     
      
      
     return{
      success: true,
      id: response.data.user.id, 
      role: response.data.user.role,
      message: response.data.message //login exitoso
     };
      
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Credenciales Invalidas');
      }
      throw new Error(error.response?.data?.message);
    }
  },

 

  async register(email, password) {
    try {
      const response = await axios.post(`${API_URL}/register`, { email, password 

      },{
        headers:{
          'Content-Type': 'application/json'
        }
      });

      if(response.status !== 201){
        throw new Error('Error inesperado del Servidor');
      }
     
     
      return response.data

    } catch (error) {

      if(error.response){
        throw new Error(error.response.data.message || 'Error en el Registro')

      }else{
        throw new Error('No se pudo conectar con el Servidor');
      }
       
        
    }
    
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Recarga limpia el estado
  },

  // Añade este nuevo método
  getCurrentUser() {
    const token = localStorage.getItem('token');
    const rawUser = localStorage.getItem('user');
  
    if (!token || !rawUser) {
      return null;
    }
  
    try {
      const user = JSON.parse(rawUser);
      return {
        id: user.id,
        email: user.email,
        role: user.role || 'user',
        token
      };
    } catch (e) {
      console.error('Error al parsear user:', e);
      return null;
    }
  },



  isAdmin() {
    return localStorage.getItem('userRole') === 'admin';
  }
};
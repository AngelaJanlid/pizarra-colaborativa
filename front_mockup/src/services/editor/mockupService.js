import axios from 'axios';


const API_URL = '/api/mockup';


export default{

  async guardarMockup(editor, name, userId, token) {
    // Validación robusta del editor
    if (!editor || typeof editor !== 'object') {
      console.error('Editor inválido recibido:', editor);
      throw new Error('Instancia del editor no válida');
    }
  
    // Método seguro para obtener datos
    const getSafeData = () => {
      try {
        return {
          html: editor.getHtml?.() || '',
          css: editor.getCss?.() || '',
          components: editor.getComponents?.() || [],
          styles: editor.getStyle?.() || {},
          assets: editor.AssetManager?.getAll?.() || []
        };
      } catch (e) {
        console.error('Error al extraer datos del editor:', e);
        return null;
      }
    };
  
    const editorData = getSafeData();
    if (!editorData) {
      throw new Error('No se pudieron obtener los datos del editor');
    }
  
    // Prepara los datos para enviar
    const payload = {
      name,
      data: editorData,
      userId: Number(userId) || JSON.parse(localStorage.getItem('user')).id // Obtén el userId desde localStorage si no se pasa
    };
  
    console.log('Enviando payload:', payload);
  
    try {
      const response = await axios.post(`${API_URL}/createMockup`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`, // Usa el token directamente
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error en la petición:', {
        config: error.config,
        response: error.response?.data
      });
      throw error;
    }
  },


      
      //---obtener mockup por id
    
      async obtenerMockupPorId(mockupId, token) {
        if (!mockupId || !token) {
          throw new Error('mockupId o token no proporcionados');
        }
      
        try {
          console.log(`Solicitando mockup con ID: ${mockupId}`);
          const response = await axios.get(`${API_URL}/${mockupId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
      
          // Log detallado de la respuesta
          console.log('Respuesta completa de la API:', response);
      
          if (!response.data || typeof response.data !== 'object') {
            throw new Error('La respuesta del servidor no tiene el formato esperado');
          }
      
          // Validación de la estructura del mockup
          const mockupData = response.data.result;
          if (!mockupData || !mockupData.data) {
            console.warn('El contenido del mockup está vacío o no tiene el formato esperado:', mockupData);
            throw new Error('El contenido del mockup está vacío o no tiene el formato esperado');
          }

          if (mockupData.data.length > 100000) { // Ajusta el límite según tus necesidades
            console.warn('El mockup es demasiado grande. Esto puede afectar el rendimiento.');
          }
      
          console.log('Mockup obtenido correctamente:', mockupData);
          return mockupData;
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
          console.error('Error al obtener el mockup:', errorMessage);
          throw new Error(`Error al obtener el mockup: ${errorMessage}`);
        }
      },

      // Actualizar un mockup
      async actualizarMockup(mockupId, editorData, userId, token) {
        try {
          console.log('Enviando solicitud PUT para actualizar mockup:', {
            id: mockupId,
            name: editorData.name,
            data: editorData.data,
            userId,
          });
      
          const response = await axios.put(
            `${API_URL}/update`,
            {
              id: mockupId,
              name: editorData.name,
              data: editorData.data,
              userId: JSON.parse(localStorage.getItem('user')).id, // Cambia esto si es necesario
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('User ID:', JSON.parse(localStorage.getItem('user')).id);
          console.log('Respuesta del servidor:', response.data);
          return response.data;
        } catch (error) {
          console.error('Error al actualizar el mockup:', error.response?.data || error.message);
          throw error;
        }
      },
     //--- listar todos los mockups del usuarios
    
     async obtenerMockupPorUser(userId, token) {
      if (!userId || !token) {
        throw new Error('userId o token no proporcionados');
      }
    
      try {
        const response = await axios.get(`${API_URL}/${userId}/miMockups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error al obtener los mockups del usuario:', error.response?.data || error.message);
        throw error;
      }
    },
    
     //listar todos los mockups
     async obtenerMockups(token) {
      try {
        // Verifica que el token esté disponible
        if (!token) {
          throw new Error('Token no proporcionado. No se puede obtener los mockups.');
        }
    
        // Realiza la solicitud al backend para obtener todos los mockups
        const response = await axios.get(`${API_URL}/AllMockups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        // Devuelve los datos obtenidos
        console.log('Mockups cargados:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al obtener los mockups:', error.response?.data || error.message);
        throw error; // Lanza el error para que el componente lo maneje
      }
    },
     
      //eliminar mockups
    
      async eliminarMockup(mockupId){
        try{
          
          const response = await axios.delete(`${API_URL}/${mockupId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          return response.data

        } catch(error){
          console.error('Error', error.response?.data || error.message);
          throw error;
        }
      },
    
    
    
    // genera el json del estado actual del editor
    
      // Método auxiliar mejorado
  getEditorJson(editor) {
    try {
        return {
            html: editor.getHtml(),
            css: editor.getCss(),
            components: editor.getComponents(),
            styles: editor.getStyle(),
            assets: editor.AssetManager.getAll(),
            timestamp: new Date().toISOString()
        };
        } catch (e) {
        console.error('Error al obtener datos del editor:', e);
        return { error: 'No se pudieron obtener los datos del editor' };
        }
    },
    
    
    // carga json en el editor
    
      loadJsonToEditor(editor, jsonData){
        
        //limpiar el editor
    
        editor.getWrapper().components().reset();
    
        //cargar datos
    
        if(jsonData.projectData){
    
          editor.loadProjectData(jsonData.projectData);
        }else{
          //fallback para versiones anteriores
          editor.setComponents(jsonData.html || '');
          editor.setStyle(jsonData.css || ''); 
        }
    
        //cargar assets si existen
    
        if(jsonData.assets){
          editor.AssetManager.add(jsonData.assets);
        }
    
          editor.refresh();
    
        
      },
    
     // ==================== UTILIDADES ====================
      
      /**
       * Descargar JSON localmente
       * @param {Object} editor 
       * @param {string} fileName 
       */
      downloadJson(editor, fileName = 'mockup') {
        const dataStr = JSON.stringify(this.getEditorJson(editor), null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}_${new Date().toISOString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
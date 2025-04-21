<template>
  <div class="editor-container">
    <div id="gjs" class="editor-canvas"></div>
    
    <div class="editor-controls">
      <button @click="mostrarModalGuardado" class="control-btn fas-save">
         Guardar
      </button>
      <button @click="exportarAngular" class="control-btn fas-save">
         Código Angular
      </button>   
    </div>

    <!-- Modal para guardar -->
    <dialog ref="saveModal" class="save-modal">
      <h3>Guardar diseño</h3>
      <div class="modal-content">
        <label for="project-name">Nombre del proyecto:</label>
        <input style="background-color: #fff; color: #000; border-radius: 4px;"
          type="text"
          id="project-name"
          v-model="projectName"
          placeholder="Mi diseño"
          @keyup.enter="confirmarGuardado"
          ref="nameInput"
        >
      </div>
      <div class="modal-actions">
        <button @click="cancelarGuardado" class="btn-cancel">Cancelar</button>
        <button @click="confirmarGuardado" class="btn-save">Aceptar</button>
      </div>
    </dialog>

    <!-- Nuevo modal para Angular -->
    <dialog ref="angularModal" class="angular-modal">
      <h3>Código Angular Generado</h3>
      <div class="modal-content">
        <pre ref="codeBlock">{{ angularCode }}</pre>
      </div>
      <div class="modal-actions">
        <button @click="copiarCodigoAngular" class="btn-copy">
          <i class="fas fa-copy"></i> Copiar
        </button>
        <button @click="descargarCodigoAngular" class="btn-download">
          <i class="fas fa-download"></i> Descargar
        </button>
        <button @click="cerrarModalAngular" class="btn-cancel">Cerrar</button>
      </div>
    </dialog>
  </div>
</template>

<script>
import { initEditor } from '../../services/editor/editorService';
import mockupService from '../../services/editor/mockupService';
import { useToast } from 'vue-toastification';
import * as cheerio from 'cheerio';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-typescript';



export default {
  name: 'GrapesEditor',
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    mockupId: {  // Añade esto como prop
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      editor: null,
      projectName: '',
      saveModal: null,
      isLoading: false,
      loading: false,
      editorReady: false,
      localMockupId: this.mockupId,
      secureMockupId: null, 
      showAngularModal: false,
      angularCode: '', // Variable para almacenar el código Angular generado  
      angularModal: null, 
    };
  },
  watch: {
    // Añadir watcher para reaccionar a cambios en initialMockupId
    mockupId(newVal) {
     
      if (newVal !== this.localMockupId) {
        this.localMockupId = newVal;
        this.cargarMockupExistente(newVal);
      }
    }
  },

  async mounted() {
       
      await this.initializeEditor()
    },

  methods: {
    

      /**
     * Método público para iniciar la edición desde un botón externo
     * @param {String} id - ID del mockup a cargar
     */
     async initializeEditor() {
            try {
        
        const query = this.$route.query;
        const editing = query.editing === 'true';
        const currentMockup = localStorage.getItem('currentMockup');
        const mockupData = currentMockup ? JSON.parse(currentMockup) : null;

        const storedProjectName = localStorage.getItem('projectName');
        this.projectName = storedProjectName || (mockupData?.name || 'Nuevo diseño');
        console.log('Nombre del proyecto cargado:', this.projectName);

        // Verifica si los datos del mockup son válidos
        let components = '<div></div>';
        let styles = '';
        if (editing && mockupData) {
          try {
            const parsedData = typeof mockupData.data === 'string' ? JSON.parse(mockupData.data) : mockupData.data;
            components = parsedData.components || '<div></div>';
            styles = parsedData.styles || parsedData.css || '';


          } catch (error) {
            console.error('Error al parsear los datos del mockup:', error);
          }
        }

        // Inicializa el editor
        this.editor = initEditor('gjs', {
          components,
          styles,
        });

        console.log('Editor inicializado:', this.editor);

        // Si hay un mockupId, cargar el mockup existente
        if (editing && mockupData) {
          console.log('Cargando mockup existente:', mockupData);
          this.localMockupId = mockupData.id;
        } else {
          console.log('Iniciando pizarra vacía');
          this.localMockupId = null;
          this.projectName = 'Nuevo diseño';
        }
          } catch (error) {
            console.error('Error inicializando editor:', error);
          }      
            },

          setupEditorEvents() {
            this.editor.on('component:selected', () => {
            this.editor.refresh();
            });
        },

    
    mostrarModalGuardado() {
        const modal = this.$refs.saveModal;
        if (!modal) {
          this.showError('No se pudo encontrar el modal de guardado.');
          return;
        }
        // Verifica el valor de projectName
         //console.log('Nombre del proyecto antes de abrir el modal:', this.projectName);

        // Asegúrate de que projectName tenga un valor predeterminado
        if (!this.projectName) {
          this.projectName = 'Nuevo diseño';
        }

        try {
          modal.showModal();
          this.$nextTick(() => {
            this.$refs.nameInput.focus();
          });
        } catch (error) {
          console.error('Error al mostrar el modal:', error);
          this.showError('No se pudo mostrar el modal. Verifica la compatibilidad del navegador.');
        }
      },


    cancelarGuardado() {
      const modal = this.$refs.saveModal;
      if (!modal) {
        console.error('No se pudo encontrar el modal de guardado.');
        return;
      }

      try {
        modal.close();
      } catch (error) {
        console.error('Error al cerrar el modal:', error);
      }
    },


    async confirmarGuardado() {
  if (!this.projectName.trim()) {
    this.showError('Debes ingresar un nombre para el proyecto');
    return;
  }

  const confirmMessage = this.localMockupId
    ? `¿Estás seguro de actualizar el mockup "${this.projectName}"?`
    : `¿Estás seguro de guardar el nuevo mockup "${this.projectName}"?`;

  if (!confirm(confirmMessage)) {
    return;
  }

  try {
    this.isLoading = true;
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!userData?.id || !token) {
      throw new Error('Debes iniciar sesión para guardar diseños');
    }

    // Obtenemos los datos del editor
    const editorData = {
      name: this.projectName,
      data: this.getEditorData(),
    };

    // Llama a la función guardarMockup
    const resultado = await this.guardarMockup(this.localMockupId, editorData, token);
    console.log('Respuesta del backend:', resultado);
    // Actualiza el ID del mockup si es un nuevo mockup
    if (!this.localMockupId) {
      this.localMockupId = resultado.data.id;
      this.$emit('update:mockupId', this.localMockupId);
    }

    // Almacena el nombre del proyecto en localStorage
    localStorage.setItem('projectName', this.projectName);
    console.log('Nombre del proyecto almacenado:', this.projectName);

    this.showSuccess(this.localMockupId
      ? `Mockup "${this.projectName}" actualizado correctamente`
      : `Nuevo mockup "${this.projectName}" creado con éxito`);

    if (this.$refs.saveModal) {
      this.$refs.saveModal.close();
    } else {
      console.warn('El modal de guardado no está disponible.');
    }

    return resultado;

  } catch (error) {
    this.manejarErrorGuardado(error);
  } finally {
    this.isLoading = false;
  }
},

        manejarErrorGuardado(error) {
          console.error('Error al guardar el mockup:', error);

          // Muestra un mensaje de error al usuario
          this.showError(
            error.message || 'Ocurrió un error al guardar el mockup. Por favor, intenta nuevamente.'
          );
        },
      

        // Función auxiliar para obtener datos del editor
        getEditorData() {
          return {
            html: this.editor.getHtml(),
            css: this.editor.getCss(),
            components: this.editor.getComponents(),
            styles: this.editor.getStyle(),
            assets: this.editor.AssetManager.getAll()
          };
        },


  


      getUserRole() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.role || 'user'; // Por defecto, asume que es un usuario normal
      },
  


    async guardarMockup(mockupId, editorData, token) {
  try {


    const role = this.getUserRole();

    if (role !== 'admin' && role !== 'user') {
      throw new Error('No tienes permiso para realizar esta acción');
    }
    
    if (mockupId) {
      // Actualizar un mockup existente
      const response = await mockupService.actualizarMockup(mockupId, editorData, token);
     
      return response;
    } else {
    
      const userId = JSON.parse(localStorage.getItem('user')).id; // Obtén el userId desde localStorage
      const response = await mockupService.guardarMockup(
        this.editor,
        editorData.name,
        userId,
        token
      );
      
      return response;
    }
  } catch (error) {
    console.error('Error al guardar o actualizar el mockup:', error);
    throw error;
  }
},



    showSuccess(message) {
      const toast = useToast();
      toast.success(message, {
        timeout: 3000,
        position: 'top-right',
      });
    },
    showError(message) {
      const toast = useToast();
      toast.error(message, {
        timeout: 3000,
        position: 'top-right',
      });
    },


//--------------Mostrar Codigo Angular con cheerio------------------------------

async exportarAngular() {
  try {
    if (!this.editor) {
      throw new Error('Editor no inicializado');
    }

    // Obtener HTML y CSS del editor
    const html = this.editor.getHtml();
    const css = this.editor.getCss();
    
    // Transformar a componente Angular
    this.angularCode = this.generateAngularComponent(html, css);
    
    // Esperar a la actualización del DOM
    await this.$nextTick();
    
    // Mostrar el modal
    this.angularModal = this.$refs.angularModal;
    
    // Verificar si el modal existe
    if (!this.angularModal) {
      throw new Error('No se encontró el elemento modal');
    }
    
    // Mostrar el modal
    this.angularModal.showModal();
    
    // Resaltar sintaxis después de que el modal esté visible
    setTimeout(() => {
      const codeBlock = this.$refs.codeBlock;
      if (codeBlock) {
        codeBlock.innerHTML = Prism.highlight(
          this.angularCode, 
          Prism.languages.typescript, 
          'typescript'
        );
      }
    }, 100);
    
  } catch (error) {
    console.error('Error al exportar a Angular:', error);
    useToast().error('Error al generar código Angular: ' + error.message);
  }
},

    // Método para exportar a Angular
   // Genera el código del componente Angular
generateAngularComponent(html, css) {
  // Limpiar y formatear el HTML
  const cleanedHtml = this.cleanHtmlForAngular(html);
  
  // Generar el nombre del componente basado en el nombre del proyecto
  const componentName = this.projectName 
    ? this.sanitizeComponentName(this.projectName) 
    : 'GeneratedComponent';
  
  // Analizar el HTML para características avanzadas
  const hasForms = this.hasForms(cleanedHtml);
  const hasHttp = this.hasApiCalls(cleanedHtml);
  const hasState = this.hasStateManagement(cleanedHtml);
  
  // Plantilla del componente Angular mejorada
  return `import { Component${hasForms || hasHttp || hasState ? ', inject' : ''} } from '@angular/core';
import { CommonModule } from '@angular/common';
${hasForms ? "import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';" : ""}
${hasHttp ? "import { HttpClient, HttpClientModule } from '@angular/common/http';" : ""}
${hasState ? "import { Store } from '@ngrx/store';" : ""}

@Component({
  selector: 'app-${componentName.toLowerCase()}',
  standalone: true,
  imports: [
    CommonModule${hasForms ? ",\n    FormsModule,\n    ReactiveFormsModule" : ""}${hasHttp ? ",\n    HttpClientModule" : ""}
  ],
  template: \`
${this.indentHtml(cleanedHtml)}
  \`,
  styles: [\`
${this.indentCss(css)}
  \`]
})
export class ${componentName}Component {
  // Servicios${hasForms ? '\n  private fb = inject(FormBuilder);' : ''}${hasHttp ? '\n  private http = inject(HttpClient);' : ''}${hasState ? '\n  private store = inject(Store);' : ''}

  // Estado del componente
  loading = false;
  error: string | null = null;
  
  ${this.generateForms(cleanedHtml)}
  
  ${this.generateTemplateProperties(cleanedHtml)}

  // Lógica del componente aquí
  ${this.generateComponentMethods(cleanedHtml)}
}`;
},

// Métodos auxiliares nuevos
hasForms(html) {
  const $ = cheerio.load(html);
  return $('input, select, textarea, form').length > 0;
},

hasApiCalls(html) {
  const $ = cheerio.load(html);
  return $('[data-api], [data-endpoint]').length > 0;
},

hasStateManagement(html) {
  const $ = cheerio.load(html);
  return $('[data-store], [data-state]').length > 0;
},

generateForms(html) {
  const $ = cheerio.load(html);
  let formsCode = '';
  
  $('form').each((i, el) => {
    const formName = $(el).attr('id') || `form${i}`;
    formsCode += `${formName} = this.fb.group({\n    `;
    
    $(el).find('input, select, textarea').each((j, field) => {
      const fieldName = $(field).attr('name') || `field${j}`;
      formsCode += `${fieldName}: [''],\n    `;
    });
    
    formsCode += `});\n\n  `;
  });
  
  return formsCode.trim();
},

generateTemplateProperties(html) {
  const $ = cheerio.load(html);
  let properties = '';
  
  // Para elementos repetitivos
  $('[data-repeat]').each((i, el) => {
    const propName = $(el).attr('data-repeat') || `items${i}`;
    properties += `${propName}: any[] = [];\n  `;
  });
  
  return properties.trim();
},

indentHtml(html) {
    try {
      if (!html) return '';
      return html.split('\n')
        .map(line => line.trim() ? `    ${line}` : '')
        .join('\n');
    } catch {
      return html || ''; // Devuelve el original si hay error
    }
  },

  // Función para indentar CSS
  indentCss(css) {
    try {
      if (!css) return '';
      return css.split('\n')
        .map(line => line.trim() ? `    ${line}` : '')
        .join('\n');
    } catch {
      return css || ''; // Devuelve el original si hay error
    }
  },

  // Función para limpiar HTML
  cleanHtmlForAngular(html) {
    try {
      if (!html) return '';
      
      // Usamos un parser simple si cheerio no está disponible
      const div = document.createElement('div');
      div.innerHTML = html;
      
      // Eliminar elementos no deseados
      Array.from(div.querySelectorAll('script, style, link')).forEach(el => el.remove());
      
      // Limpiar atributos problemáticos
      Array.from(div.querySelectorAll('*')).forEach(el => {
        el.removeAttribute('data-gjs-type');
        el.removeAttribute('data-highlightable');
        el.removeAttribute('data-gjs-draggable');
      });
      
      return div.innerHTML;
    } catch {
      return html; // Devuelve el original si hay error
    }
  },



generateComponentMethods(html) {
  const $ = cheerio.load(html);
  let methods = '';
  
  // Métodos para formularios
  $('form').each((i, el) => {
    const formName = $(el).attr('id') || `form${i}`;
    methods += `submit${formName.charAt(0).toUpperCase() + formName.slice(1)}(event: Event) {
    event.preventDefault();
    if (this.${formName}.valid) {
      console.log('Form submitted', this.${formName}.value);
    }
  }\n\n  `;
  });
  
  // Métodos para API calls
  $('[data-api]').each((i, el) => {
    const endpoint = $(el).attr('data-api');
    methods += `fetch${i}() {
    this.loading = true;
    this.http.get('${endpoint}').subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Response:', response);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message;
      }
    });
  }\n\n  `;
  });
  
  return methods.trim();
},

  
sanitizeComponentName(name) {
    try {
      // 1. Asegurar que tenemos un string válido
      const strName = (name || 'App')
        .toString() // Convierte cualquier tipo a string
        .trim()     // Elimina espacios al inicio/final
        .replace(/[^a-zA-Z0-9]/g, ' ') // Reemplaza caracteres especiales
        .replace(/\s+/g, ' '); // Elimina múltiples espacios
      
      if (!strName) return 'AppComponent'; // Fallback si está vacío

      // 2. Convertir a PascalCase de forma segura
      const pascalCase = strName
        .split(' ')
        .filter(word => word.length > 0) // Filtra palabras vacías
        .map(word => {
          // Protección adicional para cada palabra
          try {
            return word.charAt(0).toUpperCase() + 
                   (word.length > 1 ? word.slice(1).toLowerCase() : '');
          } catch {
            return word; // Si falla, devuelve la palabra sin modificar
          }
        })
        .join('');

      // 3. Asegurar que comienza con letra
      const validName = /^[A-Za-z]/.test(pascalCase) 
        ? pascalCase 
        : 'App' + pascalCase;

      // 4. Añadir 'Component' si no está presente
      return validName.endsWith('Component') 
        ? validName 
        : validName + 'Component';
    } catch (error) {
      console.error('Error sanitizing component name:', error);
      return 'AppComponent'; // Fallback absoluto
    }
  },

  generateSelectorName(componentName) {
    try {
      return componentName
        .replace(/Component$/, '')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();
    } catch {
      return 'app';
    }
  },

  

// Mejoramos la limpieza del HTML
cleanHtmlForAngular(html) {
  const $ = cheerio.load(html);
  
  // Remover elementos no deseados
  $('script, style, link[rel="stylesheet"]').remove();
  
  // Convertir atributos a directivas Angular
  $('[data-if]').each(function() {
    const $el = $(this);
    $el.attr('*ngIf', $el.attr('data-if'));
    $el.removeAttr('data-if');
  });
  
  $('[data-repeat]').each(function() {
    const $el = $(this);
    $el.attr('*ngFor', `let item of ${$el.attr('data-repeat')}`);
    $el.removeAttr('data-repeat');
  });
  
  // Limpiar atributos problemáticos
  $('*').each(function() {
    $(this).removeAttr('data-gjs-type')
           .removeAttr('data-highlightable')
           .removeAttr('data-gjs-draggable');
  });
  
  return $.html();
},

    // Copia el código Angular al portapapeles
    copiarCodigoAngular() {
      navigator.clipboard.writeText(this.angularCode)
        .then(() => {
          useToast().success('Código copiado al portapapeles');
        })
        .catch(err => {
          console.error('Error al copiar:', err);
          useToast().error('Error al copiar el código');
        });
    },

    descargarCodigoAngular() {
  try {
    // Obtener nombre del componente
    const componentName = this.projectName 
      ? this.sanitizeComponentName(this.projectName)
      : 'my-component';
    
    // Crear nombre de archivo válido
    const fileName = `${componentName.toLowerCase().replace('component', '')}.component.ts`;
    
    // Crear blob con el código
    const blob = new Blob([this.angularCode], { type: 'text/typescript' });
    
    // Crear enlace de descarga
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Simular click
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    // Notificar éxito
    useToast().success(`Componente ${fileName} descargado`);
  } catch (error) {
    console.error('Error al descargar:', error);
    useToast().error('Error al descargar el código');
  }
},

    // Cierra el modal de Angular
    cerrarModalAngular() {
      this.angularModal.close();
    },

    // ... (tus otros métodos existentes)
  },
};


</script>

<style scoped>


.editor-container {
  position: relative;
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
}

.editor-canvas {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
}

.editor-controls {
  padding: 10px;
  background: #f5f5f5;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}


.control-btn {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.control-btn:hover {
  background: #45a049;
}

.control-btn.danger {
  background: #f44336;
}

.control-btn.danger:hover {
  background: #d32f2f;
}

.control-btn i {
  font-size: 14px;
}

/* Estilos para el modal */
.save-modal {
  border: none;
  background-color: #2D336B;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.save-modal::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  margin: 15px 0;
}

.modal-content input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.angular-modal {
  width: 80%;
  max-width: 800px;
  border: none;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.angular-modal::backdrop {
  background: rgba(0, 0, 0, 0.7);
}

.angular-modal h3 {
  background: #1976d2;
  color: white;
  padding: 16px;
  margin: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.angular-modal .modal-content {
  padding: 16px;
  max-height: 60vh;
  overflow: auto;
}

.angular-modal pre {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  margin: 0;
}

.angular-modal .modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.btn-copy {
  background: #4CAF50;
  color: white;
}

.btn-download {
  background: #2196F3;
  color: white;
}

.btn-cancel {
  background: #f44336;
  color: white;
}



.btn-save:hover {
  background: #45a049;
}

.angular-modal {
  width: 80%;
  max-width: 800px;
  border: none;
  border-radius: 8px;
  padding: 20px;
  background: #2d2d2d;
  color: #f8f8f2;
}

.angular-modal::backdrop {
  background: rgba(0, 0, 0, 0.7);
}

.angular-modal .modal-content {
  max-height: 60vh;
  overflow: auto;
  margin: 15px 0;
}

.angular-modal pre {
  margin: 0;
  padding: 15px;
  background: #1e1e1e;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
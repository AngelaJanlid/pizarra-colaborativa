
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
import grapesjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjs from 'grapesjs';

const editorConfig = {
  height: '100vh', // Altura del editor
  width: '100%', // Ancho del editor
  autorender: true, // Activa el renderizado automático
  storageManager: false, // Desactiva el almacenamiento automático
  plugins: [grapesjsBlocksBasic, grapesjsPresetWebpage], // Plugins básicos
  pluginsOpts: {
    'grapesjs-blocks-basic': {
      flexGrid: false,
      blocks: ['button', 'image', 'text', 'video', 'input', 'textarea'], // Bloques básicos
    },
    /*'gjs-preset-webpage': {
      blocks: ['quote', 'text-section'], // Bloques adicionales
      navbar: false,
      forms: true,
    },*/
  },
  canvas: {
    styles: ['https://unpkg.com/grapesjs/dist/css/grapes.min.css'], // Estilos del canvas
    scripts: [], // Scripts adicionales
  },
};

export const initEditor = (containerId, initialData = null) => {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Contenedor #${containerId} no encontrado`);
  }

  // Asegurar que el contenedor tenga estilos mínimos
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.height = '100vh'; // o el alto que necesites
  container.style.width = '100%';
  container.style.overflow = 'hidden';

  // Inicializa el editor
  const editor = grapesjs.init({
    ...editorConfig,
    container: `#${containerId}`,
    // Configuración adicional para asegurar visibilidad
    canvas: {
      styles: ['https://unpkg.com/grapesjs/dist/css/grapes.min.css'],
      scripts: [],
      height: '100%',
      width: '100%',
    }
  });

  // Evento para cuando el editor esté completamente listo
  editor.on('load', () => {
    //console.log('Editor completamente cargado');
    //editor.Panels.getButton('views', 'open-blocks').set('active', true);
    // Configuración de bloques
    const blockManager = editor.BlockManager;
    if (blockManager) {
      blockManager.add('my-button', {
        label:  `
        <svg width="80" height="50" fill="currentColor" viewBox="0 0 16 16">
        <path d="M6 3.5a.5.5 0 0 0-1 0v4.707L3.354 6.56a.5.5 0 1 0-.708.708l2.5 2.5a.5.5 0 0 0 .708 0l2.5-2.5a.5.5 0 1 0-.708-.708L6 8.207V3.5z"/>
        </svg> 
        Botón`,
        content: '<button class="btn">Click aquí</button>',
        category: 'Basic',
        attributes: { class: 'gjs-block' },
      });
      
      blockManager.add('my-heading1', {
        label:  `
        <svg width="80" height="50" fill="currentColor" viewBox="0 0 16 16">
        <path d="M6 3.5a.5.5 0 0 0-1 0v4.707L3.354 6.56a.5.5 0 1 0-.708.708l2.5 2.5a.5.5 0 0 0 .708 0l2.5-2.5a.5.5 0 1 0-.708-.708L6 8.207V3.5z"/>
        </svg> 
        Título H1`,
        content: '<h1>Encabezado H1</h1>',
        category: 'Basic',
        attributes: { class: 'gjs-block' },
      });
      
      blockManager.add('my-heading2', {
        label:  `
        <svg width="80" height="50" fill="currentColor" viewBox="0 0 16 16">
        <path d="M6 3.5a.5.5 0 0 0-1 0v4.707L3.354 6.56a.5.5 0 1 0-.708.708l2.5 2.5a.5.5 0 0 0 .708 0l2.5-2.5a.5.5 0 1 0-.708-.708L6 8.207V3.5z"/>
        </svg> 
        Título H2`,
        content: '<h2>Encabezado H2</h2>',
        category: 'Basic',
        attributes: { class: 'gjs-block' },
      });
      
      blockManager.add('my-ul', {
        label:  `
        <svg width="80" height="50" fill="currentColor" viewBox="0 0 16 16">
        <path d="M6 3.5a.5.5 0 0 0-1 0v4.707L3.354 6.56a.5.5 0 1 0-.708.708l2.5 2.5a.5.5 0 0 0 .708 0l2.5-2.5a.5.5 0 1 0-.708-.708L6 8.207V3.5z"/>
        </svg> 
        Lista UL`,
        content: '<ul><li>Elemento 1</li><li>Elemento 2</li><li>Elemento 3</li><li>Elemento 4</li><li>Elemento 5</li><li>Elemento 6</li></ul>',
        category: 'Basic',
        attributes: { class: 'gjs-block' },
      });
      
      blockManager.add('my-ol', {
        label:  `
        <svg width="80" height="50" fill="currentColor" viewBox="0 0 16 16">
        <path d="M6 3.5a.5.5 0 0 0-1 0v4.707L3.354 6.56a.5.5 0 1 0-.708.708l2.5 2.5a.5.5 0 0 0 .708 0l2.5-2.5a.5.5 0 1 0-.708-.708L6 8.207V3.5z"/>
        </svg> 
        Lista OL`,
        content: '<ol><li>Elemento 1</li><li>Elemento 2</li><li>Elemento 3</li><li>Elemento 4</li><li>Elemento 5</li><li>Elemento 6</li></ol>',
        category: 'Basic',
        attributes: { class: 'gjs-block' },
      });

      editor.runCommand('open-blocks');
    }

    // Carga de datos iniciales
    if (initialData) {
      try {
        editor.setComponents(initialData.components || '<div></div>');
        editor.setStyle(initialData.styles ||initialData.css || '');

        if (initialData.assets && initialData.assets.length > 0) {
          editor.AssetManager.add(initialData.assets);
        }

        console.log('Datos iniciales cargados en el editor');
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      }


    }

    // Forzar redibujado del canvas
    setTimeout(() => {
      editor.refresh();
      console.log('Editor refrescado');
    }, 300);
  });

  // Manejo de errores
  editor.on('error', (err) => {
    console.error('Error en editor:', err);
  });

  return editor;
};

export const setupEditorVisibility = (editor) => {
  editor.on('canvas:frame:load', () => {
    setTimeout(() => {
      try {
        const frame = editor.Canvas.getFrameEl();
        const toolsEl = editor.Canvas.getToolsEl();
        const canvasEl = editor.Canvas.getBody();

        if (!frame || !frame.contentDocument) {
          console.error('El frame no está disponible');
          return;
        }

        // Asegurar visibilidad del frame
        frame.style.display = 'block';
        frame.style.visibility = 'visible';
        frame.style.opacity = '1';
        frame.style.position = 'relative';
        frame.style.height = '100%';
        frame.style.width = '100%';
        frame.style.background = '#fff';
        frame.style.border = 'none';
        frame.style.overflow = 'auto';

        // Asegurar visibilidad del contenido del canvas
        if (canvasEl) {
          canvasEl.style.display = 'block';
          canvasEl.style.visibility = 'visible';
          canvasEl.style.opacity = '1';
          canvasEl.style.height = '100%';
          canvasEl.style.width = '100%';
          canvasEl.style.background = '#fff';
          canvasEl.style.minHeight = '100px';
        }

        // Configurar herramientas
        if (toolsEl) {
          toolsEl.style.display = 'flex';
          toolsEl.style.opacity = '1';
          toolsEl.style.visibility = 'visible';
        }

        // Forzar redibujado
        editor.render();

        console.log('Visibilidad del editor configurada correctamente');
      } catch (error) {
        console.error('Error al configurar visibilidad:', error);
      }
    }, 100);
  });

  // Manejar cambios de tamaño
  window.addEventListener('resize', () => {
    editor.refresh();
  });
};

//------------------conversion GrapesJS a  Angula con Cheerio------------------














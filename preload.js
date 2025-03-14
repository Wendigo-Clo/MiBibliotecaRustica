const { contextBridge, ipcRenderer } = require('electron');

// Aquí expones funciones seguras que se usarán en el renderer (la UI de Electron)
contextBridge.exposeInMainWorld('electron', {
  // Esta función pedirá al proceso principal que inicie el servidor
  startServer: () => ipcRenderer.send('start-server'),
  // Función para obtener los datos de los libros (ejemplo)
  fetchBooks: () => ipcRenderer.invoke('fetch-books')
});

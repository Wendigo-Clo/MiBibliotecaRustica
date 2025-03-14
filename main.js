const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let serverProcess;

app.whenReady().then(() => {
  // Ruta absoluta del servidor
  const serverPath = path.join(__dirname, "backend", "server.js");

  // Iniciar el servidor
  serverProcess = spawn("node", [serverPath], {
    cwd: path.dirname(serverPath), // Para evitar errores de ruta
    detached: true, // Para mantener el proceso activo
    stdio: "inherit", // Muestra logs en la terminal de Electron
  });

  serverProcess.on("error", (err) => {
    console.error("Error al iniciar el servidor:", err);
  });

  serverProcess.on("exit", (code) => {
    console.log(`Servidor finalizó con código: ${code}`);
  });

  // Crear la ventana cuando el servidor esté listo
  setTimeout(() => {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    mainWindow.loadFile(path.join(__dirname, 'frontend', 'index.html'));
  }, 3000); // Espera 3s para que el servidor se levante correctamente
});

app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill(); // Detener el servidor al cerrar Electron
  app.quit();
});


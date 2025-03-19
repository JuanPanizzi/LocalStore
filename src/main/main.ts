import { app, BrowserWindow, ipcMain, session, Menu, shell, protocol, net } from 'electron';
import { join } from 'path';
import { ipcMainProcess } from "./ipcMain";  
// Ruta correcta dentro del directorio de la app en Electron
import path from 'node:path';
import url from 'node:url';

// Esto se coloca al inicio de tu main.ts, antes de app.whenReady()
protocol.registerSchemesAsPrivileged([
  { scheme: 'local', privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);

function createWindow() {

  // Crea la ventana splash
  // const splash = new BrowserWindow({
  //   width: 496,  // Igual al ancho del video
  // height: 496, // Igual al alto del video
  //   frame: false,
  //   alwaysOnTop: true,
  //   transparent: true,
  //   resizable: false, // Evita que se redimensione
  //   webPreferences: {
  //     preload: join(app.getAppPath(), 'main',  'preload.js'),
  //     nodeIntegration: true,
  //     contextIsolation: true,
  //   }
  // });
  // splash.loadFile(join(app.getAppPath(), 'static', 'splash.html'));

  const mainWindow = new BrowserWindow({
    width: 1360,
    height: 980,
    show: false,
    webPreferences: {
      preload: join(app.getAppPath(), 'main', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  mainWindow.maximize();
  ipcMainProcess(mainWindow);
  // open dev tools
  // mainWindow.webContents.openDevTools();
  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);

    
    
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
    // mainWindow.loadFile(join(__dirname, 'renderer', 'index.html'));

  }
  
  // Después de 5 segundos, ocultar el splash y mostrar la ventana principal
  setTimeout(() => {
    // splash.close();
    mainWindow.show();
  }, 5000);

  const template = [
    {
      label: 'Archivo',
      submenu: [
        { role: 'quit', label: 'Salir' }
      ]
    },

      {
        label: 'Ver',
        submenu: [ 
          { role: 'forceReload', label: 'Forzar recarga' },
          { role: 'toggleDevTools', label: 'Alternar herramientas de desarrollo' }, 
        ]
      }, 
    {
      label: 'Ayuda',
      submenu: [
        // {

        //   label: 'Documentación',
        //   click: async () => {
        //     console.log(pdfPath)

        //     if (existsSync(pdfPath)) {
        //       await shell.openPath(pdfPath);
        //     } else {
        //       console.error('PDF file does not exist:', pdfPath);
        //     }    
 
        //   }
        // },
        {
          label: 'Acerca de',
          click: createAboutWindow
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template as Electron.MenuItemConstructorOptions[]);
  Menu.setApplicationMenu(menu);
}


function createAboutWindow() {
 

  const aboutWindow = new BrowserWindow({
    width: 500,
    height: 550,
    modal: true,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });


  const htmlContent = `
    <html>

<head>
  <title>Acerca de</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      text-align: center;
    }

    section {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center; 
    }
      .img-logo{
      max-width: 300px;
      }

    
  </style>
</head>

<body>
  <section>
    <div class="div1">
    </div>
    <div class="div2">
      <h2>Local Store</h2>
      <p>Versión 1.0.1</p>
      <p>Copyright © ${new Date().getFullYear()} David Di Natale</p>
      <p>Todos los derechos reservados.</p>
    </div>
  </section>
</body>

</html>

  `;

  aboutWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show();
  });
}

app.whenReady().then(() => {

// Registra el protocolo personalizado "local" para servir archivos locales.
// protocol.registerFileProtocol('local', (request, callback) => {
//   const url = request.url.replace('local:///', '');
//   // En este ejemplo se asume que la ruta ya es absoluta.
//   callback({ path: url });
// });


// protocol.handle('local', async (request) => {
//   // Parsear la URL completa
//   const parsedUrl = new URL(request.url);
//   let filePath = '';

//   // Si hay host, en Windows el host contendrá la letra de la unidad (ej. "C")
//   if (parsedUrl.host) {
//     // Reconstruir la ruta absoluta: concatenar host + ':' + pathname
//     filePath = `${parsedUrl.host}:${parsedUrl.pathname}`;
//   } else {
//     filePath = parsedUrl.pathname;
//   }

//   // Si la ruta no es absoluta (por ejemplo, si se esperaba una ruta relativa), opcionalmente se puede combinar con __dirname
//   if (!path.isAbsolute(filePath)) {
//     filePath = path.join(__dirname, filePath);
//   }

//   const fileUrl = url.pathToFileURL(filePath).toString();

//   try {
//     // net.fetch devuelve una promesa con la respuesta
//     return await net.fetch(fileUrl);
//   } catch (error) {
//     console.error('Error fetching file:', error);
//     // Opcional: devolver una respuesta de error
//     throw error;
//   }
// });
protocol.handle('local', async (request) => {
  const parsedUrl = new URL(request.url);
  let filePath = '';

  if (parsedUrl.host) {
    // Decodifica el pathname para convertir %20 en espacios
    filePath = `${parsedUrl.host}:${decodeURIComponent(parsedUrl.pathname)}`;
  } else {
    filePath = decodeURIComponent(parsedUrl.pathname);
  }

  // Asegúrate de tener una ruta absoluta
  if (!path.isAbsolute(filePath)) {
    filePath = path.join(__dirname, filePath);
  }

  const fileUrl = url.pathToFileURL(filePath).toString();

  try {
    return await net.fetch(fileUrl);
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
});


createWindow();



  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});
 
import { app, BrowserWindow, ipcMain, session, Menu, shell } from 'electron';
import { join } from 'path';
import { ipcMainProcess } from "./ipcMain";  
// Ruta correcta dentro del directorio de la app en Electron


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
  //     preload: join(app.getAppPath(),'main',  'preload.js'),
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
      preload: join(app.getAppPath(), 'main',  'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  //mainWindow.maximize();
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
 
import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, Protocol, protocol } from 'electron'
import path from 'path'
import { startExpressServer } from './server'
import { fileURLToPath, URL } from 'url'
import { dirname } from 'path'
import { store } from './store.ts'
import { readFile } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

declare global {
    namespace Electron {
        interface App {
            isQuitting: boolean;
        }
    }
}

app.isQuitting = false;

// Keep a global reference of objects to prevent garbage collection
let tray: Tray | null = null
let mainWindow: BrowserWindow | null = null

function setAutoLaunch(enabled: boolean) {
    app.setLoginItemSettings({
        openAtLogin: enabled,
        path: app.getPath('exe')
    })
    store.set('autoLaunch', enabled)
}

export function createProtocol(scheme: string, customProtocol?: Protocol) {
    ;(customProtocol || protocol).registerBufferProtocol(
        scheme,
        (request, respond) => {
            let pathName = new URL(request.url).pathname
            pathName = decodeURI(pathName) // Needed in case URL contains spaces

            readFile(path.join(__dirname, '../dist', pathName), (error, data) => {
                if (error) {
                    console.error(
                        `Failed to read ${pathName} on ${scheme} protocol`,
                        error,
                    )
                }
                const extension = path.extname(pathName).toLowerCase()
                let mimeType = ''

                if (extension === '.js') {
                    mimeType = 'text/javascript'
                } else if (extension === '.html') {
                    mimeType = 'text/html'
                } else if (extension === '.css') {
                    mimeType = 'text/css'
                } else if (extension === '.svg' || extension === '.svgz') {
                    mimeType = 'image/svg+xml'
                } else if (extension === '.json') {
                    mimeType = 'application/json'
                } else if (extension === '.wasm') {
                    mimeType = 'application/wasm'
                }

                respond({ mimeType, data })
            })
        },
    )
}

function createWindow() {
    mainWindow = new BrowserWindow({
        show: !!process.env.VITE_DEV_SERVER_URL,
        width: 600,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: process.env.VITE_DEV_SERVER_URL
            ? path.join(process.cwd(), 'public', '256x256.png')
            : path.join(process.resourcesPath, 'public', '256x256.png'),
    })
    mainWindow.setMenu(null)
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
        mainWindow.webContents.openDevTools({
            mode: 'undocked'
        })
    } else {
        createProtocol('app')
        mainWindow.loadURL(`app://./index.html`)
        // mainWindow.webContents.openDevTools({
        //     mode: 'undocked'
        // })
    }

    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault()
            mainWindow?.hide()
            return false
        }
        return true
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

function createTray() {
    const iconPath = process.env.VITE_DEV_SERVER_URL
        ? path.join(process.cwd(), 'public', '256x256.png')
        : path.join(process.resourcesPath, 'public', '256x256.png')

    const icon = nativeImage.createFromPath(iconPath)
    tray = new Tray(icon)
    tray.setToolTip('Izabela Next - Custom Server')
    tray.on('click', () => {
        if (mainWindow === null) {
            createWindow()
        } else {
            mainWindow.show()
        }
    })
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open Window',
            click: () => {
                if (mainWindow === null) {
                    createWindow()
                } else {
                    mainWindow.show()
                }
            }
        },
        {
            label: 'Auto Launch',
            type: 'checkbox',
            checked: store.get('autoLaunch', true) as boolean,
            click: (menuItem) => {
                setAutoLaunch(menuItem.checked)
            }
        },
        { 
            label: 'Restart',
            click: () => {
                app.isQuitting = true;
                app.relaunch();
                app.exit(0);
            } 
        },
        { type: 'separator' },
        { 
            label: 'Quit', 
            click: () => {
                app.isQuitting = true
                app.quit()
            } 
        }
    ])

    tray.setContextMenu(contextMenu)
}

ipcMain.handle('electron-store-get', async (_, key) => {
    return store.get(key);
});

ipcMain.handle('electron-store-set', async (_, { key, value }) => {
    store.set(key, value);
    return true;
});

ipcMain.handle('electron-store-delete', async (_, key) => {
    store.delete(key);
    return true;
});

ipcMain.handle('electron-store-has', async (_, key) => {
    return store.has(key);
});

app.whenReady().then(() => {
    createWindow()
    createTray()
    startExpressServer()

    const shouldAutoLaunch = store.get('autoLaunch', true) as boolean
    setAutoLaunch(shouldAutoLaunch)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('before-quit', () => {
    app.isQuitting = true
})
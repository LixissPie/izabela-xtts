import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron'
import path from 'path'
import { startExpressServer } from './server'

// Keep a global reference of objects to prevent garbage collection
let tray: Tray | null = null

function createTray() {
    const iconPath = process.env.VITE_DEV_SERVER_URL
        ? path.join(process.cwd(), 'public', '256x256.png')
        : path.join(process.resourcesPath, 'public', '256x256.png')

    const icon = nativeImage.createFromPath(iconPath)
    tray = new Tray(icon)
    tray.setToolTip('Izabela Next - Custom Server')

    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'Restart',
            click: () => {
                app.relaunch();
                app.exit(0);
            } 
        },
        { type: 'separator' },
        { 
            label: 'Quit', 
            click: () => {
                app.quit()
            } 
        }
    ])

    tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
    createTray()
    startExpressServer()
})

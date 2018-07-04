'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import Conf from 'conf'
import log from 'electron-log'

import { ProcessMonitor } from './process'
import { CasparCGHealthMonitor } from './casparcg'
import { HttpMonitor } from './http'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const config = new Conf({
  cwd: process.env.PORTABLE_EXECUTABLE_DIR,
  configName: 'casparcg-launcher.config'
})

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 768,
    useContentSize: true,
    width: process.env.NODE_ENV === 'development' ? 1600 : 1024
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('close', e => {
    const choice = dialog.showMessageBox(mainWindow,
      {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to quit?'
      })

    if (choice === 1) {
      e.preventDefault()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('config', config.store)
    startupProcesses()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopProcesses()
    httpMonitor.stop()
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

class IpcWrapper {
  constructor (ipcIn, ipcOut) {
    this.ipcIn = ipcIn
    this.ipcOut = ipcOut
  }

  on (event, cb) {
    this.ipcIn.on(event, cb)
  }

  send (event, msg) {
    this.ipcOut.send(event, msg)
  }
}

let processes = {}
let httpMonitor = new HttpMonitor(config, processes)

function startupProcesses () {
  log.info('Starting child processes')

  const wrapper = new IpcWrapper(ipcMain, mainWindow.webContents)
  wrapper.on('config.get', e => {
    e.sender.send('config', config.store)
  })
  wrapper.on('config.set', (e, arg) => {
    config.set(arg)
    e.sender.send('config', config.store)
  })

  processes['casparcg'] = new ProcessMonitor('casparcg', wrapper, config, 'casparcg.exe', new CasparCGHealthMonitor())
  processes['media-scanner'] = new ProcessMonitor('media-scanner', wrapper, config, 'scanner.exe')
}

function stopProcesses () {
  for (let proc in processes) {
    processes[proc].stop()
  }
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

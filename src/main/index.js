'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

import { ProcessMonitor } from './process'

const log = require('electron-log')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1920
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.once('did-finish-load', () => {
    startupProcesses()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopProcesses()
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

const ccgPath = 'C:\\caspar\\2.1.0_NRK_RC1\\CasparCG Server\\server\\' // TODO - config file this
let casparHost, mediaScanner

function startupProcesses () {
  log.info('Starting child processes')

  const wrapper = new IpcWrapper(ipcMain, mainWindow.webContents)

  casparHost = new ProcessMonitor('casparcg', wrapper, ccgPath, 'casparcg.exe')
  mediaScanner = new ProcessMonitor('media-scanner', wrapper, ccgPath, 'scanner.exe')
}

function stopProcesses () {
  casparHost.stop()
  mediaScanner.stop()
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

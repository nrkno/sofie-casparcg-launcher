import path from 'path'

export function getExeDir () {
  return process.env.PORTABLE_EXECUTABLE_DIR || process.cwd()
}

export function getBasePath (config) {
  let basePath = config.get('basePath', './')
  if (!path.isAbsolute(basePath)) {
    basePath = path.join(getExeDir(), basePath)
  }
  return basePath
}

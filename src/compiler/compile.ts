import metadata from '../utils/metadata'

export function compile(hasmFilePath: string) {
  if (metadata.local === null) {
    error('Cannot compile HASM file: metadata not loaded correctly.')
    return
  }

  try {
    this.local = JSON.parse(FileLib.read(metadata.local.name, fileName))
  } catch (err: any) {
    this.local = null
    error(err)
    return
  }

  // read file, store as array of lines
  // precompiler
  // parse file
  // generate actions (housing object file)
}

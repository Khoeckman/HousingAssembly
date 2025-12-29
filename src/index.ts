/// <reference types="../vendor/CTAutocomplete" />
/// <reference lib="es2015" />

import { NAME, chat, error, dialog } from './utils/ct'
import metadata from './utils/metadata'

const rootCommand = 'hasm'

register('command', (command, ...args) => {
  try {
    if (typeof command !== 'string') command = ''
    else command = command.toLowerCase()

    if (!Array.isArray(args)) args = []

    switch (command) {
      case '':
      case 'help':
        const commands = [`&6ver&esion &7 Prints the &fcurrent&7 and &flatest &aversion&7 of ${NAME}&7.`]
        dialog(
          '&eCommands',
          commands.map((line) => `&e/${rootCommand} ${line}`)
        )
        break

      case 'version':
      case 'ver':
        metadata.printVersionStatus()
        break

      default:
        error(`Unknown command. Type "/${rootCommand}" for help.`, { printStackTrace: false })
        break
    }
  } catch (err: any) {
    error(err)
  }
}).setName(rootCommand)

const firstWorldLoad = register('worldLoad', () => {
  try {
    chat(`&eModule loaded. Type "/${rootCommand}" for help.`)
    metadata.printVersionStatus()
  } catch (err: any) {
    error(err)
  } finally {
    firstWorldLoad.unregister()
  }
})

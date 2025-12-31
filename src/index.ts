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
        dialog('&eCommands', [
          `&e/${rootCommand} &6c&eonfig &7 List all config values and information.`,
          `&e/${rootCommand} &6c&eonfig set <key> <value> &7 Change a config value.`,
          `&e/${rootCommand} &6c&eonfig get <key> &7 Get a config value and information.`,
          `&e/${rootCommand} &6c&eonfig open &7 Open &fhasm.config.json&7 externally.`,
          ` &8 Example: &7/hasm config set rootPath "/path/to/hasm/files/"`,
          ``,
          `&e/${rootCommand} &6h&eouse &eimport <path> &7 Execute a &f*.config.hasm&7 file on the current house.`,
          `&e/${rootCommand} &6h&eouse &eexport <path> &7 Export current house settings to a &f*.config.hasm&7 file.`,
          `&e/${rootCommand} &6h&eouse &ediff <path> &7 Show differences between current house settings and a &f*.config.hasm&7 file.`,
          ``,
          `&e/${rootCommand} &6im&eport <path> [ <system>=<name> ] &7 Execute a &f*.hasm&7 file on a certain scope.`,
          `&e/${rootCommand} &6ex&eport <path> <system>=<name> &7 Export all actions inside &e<scope>&7 to a &f*.hasm&7 file.`,
          `&e/${rootCommand} &ediff <path> <system>=<name> &7 Show differences between all actions inside &e<scope>&7 and a &f*.hasm&7 file.`,
          ` &8 Example: &7/hasm diff "/path/to/file.hasm" function="Function Name"`,
          ``,
          `&6ver&esion &7 Prints the &fcurrent&7 and &flatest &aversion&7 of ${NAME}&7.`,
        ])
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

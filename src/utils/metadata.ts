import { NAME, chat, error } from './ct'
import type { MetadataJson, Version } from '../types/metadata'

// Helper class to load and parse the module's metadata.json
class Metadata {
  local: MetadataJson | null
  remote?: MetadataJson
  remoteURL: string | 'null' = 'null'

  constructor(moduleName: string, fileName: string, remoteURL: string | 'null' = 'null') {
    try {
      this.local = JSON.parse(FileLib.read(moduleName, fileName))
    } catch (err: any) {
      this.local = null
      error(err)
      return
    }

    if (typeof remoteURL !== 'string') {
      error(new TypeError('remoteURL is not a string').toString())
      return
    }
    this.remoteURL = remoteURL
  }

  static compareVersions(v1: Version, v2: Version) {
    const a = v1.split('.').map((n) => Number(n))
    const b = v2.split('.').map((n) => Number(n))

    for (let i = 0, len = Math.max(a.length, b.length); i < len; i++) {
      const x = a[i] || 0
      const y = b[i] || 0
      if (x > y) return 1 // v1 > v2
      if (x < y) return -1 // v1 < v2
    }
    return 0 // equal
  }

  getRemote(onFinally = () => {}) {
    new Thread(() => {
      try {
        this.remote = JSON.parse(FileLib.getUrlContent(this.remoteURL.toString()) ?? null)
      } catch (err: any) {
        error(err, { printStackTrace: false })
      } finally {
        onFinally()
      }
    }).start()
  }

  printVersionStatus() {
    if (!World.isLoaded()) return

    if (!this.local || typeof this.local.version !== 'string')
      return error(new TypeError(`Cannot read properties of ${this.local} (reading 'version')`).toString())

    /*if (false) {
      chat(
        new Message(
          `&aVersion ${this.local.version} `,
          new TextComponent('&7[&8&lGitHub&7]')
            .setClick('open_url', this.local.homepage)
            .setHover('show_text', `&fClick to view ${NAME}&f on &8&lGitHub`)
        ).setChatLineId(32486000)
      )
      return
    }*/

    chat(`&aVersion ${this.local.version} &7● Getting latest...`, 32486000)

    this.getRemote(() => this.updateVersionStatus(32486000))
  }

  updateVersionStatus = (messageId: number) => {
    if (!World.isLoaded() || !this.local || !this.remote) return

    const latestVersion =
      this.remote && typeof this.remote.version === 'string'
        ? Metadata.compareVersions(this.local.version, this.remote.version) >= 0
          ? '&2✔ Latest'
          : '&c✖ Latest ' + this.remote.version
        : '&c✖ Latest unknown'

    try {
      ChatLib.deleteChat(messageId)
      chat(
        new Message(
          `&aVersion ${this.local.version} ${latestVersion} `,
          new TextComponent('&7[&8&lGitHub&7]')
            .setHover('show_text', `&fClick to view ${NAME}&f on &8&lGitHub`)
            .setClick('open_url', this.local.homepage)
        ),
        messageId
      )
    } catch (err: any) {
      error(err)
    }
    World.playSound('mob.villager.' + (latestVersion.includes('✔') ? 'yes' : 'no'), 0.7, 1)
  }
}

export default new Metadata(
  'HousingAssembly',
  'metadata.json',
  'https://raw.githubusercontent.com/Khoeckman/HousingAssembly/refs/heads/main/metadata.json'
)

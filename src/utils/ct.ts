export const NAME = '&5&lHASM'
export const PREFIX = `&7[${NAME}&7]&r `
export const TAB = '    '

export const isJavaClass = <JavaClass>(obj: unknown, className: string): obj is JavaClass => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'getClass' in obj &&
    typeof obj.getClass === 'function' &&
    obj.getClass().getName() === className
  )
}

export const chat = (message: string | Message | TextComponent, id: number = -1) => {
  if (
    typeof message === 'string' ||
    isJavaClass<TextComponent>(message, 'com.chattriggers.ctjs.minecraft.objects.message.TextComponent')
  ) {
    message = new Message(PREFIX, message)
  } else if (isJavaClass<Message>(message, 'com.chattriggers.ctjs.minecraft.objects.message.Message')) {
    message.addTextComponent(0, new TextComponent(PREFIX))
  } else {
    message = new Message(PREFIX, String(message))
  }

  if (id > -1) message = message.setChatLineId(id & 0x7fffffff)

  message.chat()
}

export const error = (message: string, options: { printStackTrace?: boolean; sound?: boolean } = {}) => {
  const { printStackTrace = true, sound = true } = options
  ChatLib.chat('&c' + message)

  if (printStackTrace) {
    try {
      throw new Error(message)
    } catch (err: any) {
      err.stack
        .replace(/\t/g, TAB) // Spaces work better than tabs
        .split(/\r?\n/g) // Split on CRLF, LF and CR
        .forEach((line: string) => ChatLib.chat('&c' + line))
    }
  }

  if (sound) World.playSound('random.anvil_land', 0.3, 1)
}

export const dialog = (title: string, lines: string[]) => {
  ChatLib.chat('')
  chat(title)
  ChatLib.chat('')
  for (let line of lines) ChatLib.chat(TAB + line)
  ChatLib.chat('')

  World.playSound('random.click', 0.7, 1)
}

# Housing Assembly (HASM)

A ChatTriggers module to automate the creation of **Hypixel Housing projects** trough an intuitive custom programming language (`.hasm`).

Because Hypixel only provides **limited scripting capabilities** (no for-loops, condition nesting, inline arithmetic expressions) and it is a slow item clicking process, this module helps save a ton of time by letting ChatTriggers do the clicking, turning high-level textual code into Housing actions.

Using an editor like VSCode makes it easier to **spot bugs**, since you can use `Ctrl+Shift+F` to search through your entire codebase at once and quickly review every action or condition.

## Installation

1. Install [ChatTriggers 2.2.1](https://github.com/ChatTriggers/ChatTriggers/releases/tag/2.2.1)
2. Download `Source code.zip` from [Releases](https://github.com/Khoeckman/HousingAssembly/releases/latest)
3. Extract `Source code.zip` into `%appdata%/.minecraft/config/ChatTriggers/modules/HousingAssembly/`
4. Make sure the `metadata.json` file is located at `%appdata%/.minecraft/config/HousingAssembly/modules/ChatSocket/metadata.json`
5. Reload all ChatTrigger modules with `/ct load`.
6. In chat should appear: `[HASM] Module Loaded. Type "/hasm" for help.`

## Code example

Both styles can be mixed based on personal preference.

### Style: Verbose (easy to read but more code)

```js
// This is required to use cancelEvent()
@scope('event', 'Player Block Break')

// Types: Long, Double, String, Unset
#define global.x <Double> // Define global.x as: Double
#define global.y <Double?> // Define global.y as: Double or Unset

if [
  not blockType(@item('fileName'), matchTypeOnly=true)
  player.x < global.x ?? 1.0 // Uses 1.0 if global.x is Unset
  // conditions...
] any {
  // actions...
} else {
  // actions...
}

cancelEvent()

player.name = 'Mike'
player.lore = `Hello, ${player.name}`

// Works like Python's range() enumerator.
#for {i} in (10, 0, -2) { // i -> 10, 8, 6, 4, 2
  player.var{i} += 1
}

player.x = 2
player.x *= player.x
player.x += random.whole(1, 20)

global.x += player.x // TypeError: Cannot combine Double and Long. Did you forget to cast 'player.x' to a Double?
global.x += player.x(0)<Double> // Equals %var.player.x/0%D

player.x~ // Unset

p.text = p.x~ // Tilde to enable Automatic Unset
var text = "%var.player/x%" true

player.text = player.x! // Exclamation mark to disable Automatic Unset
player.text = player.x? // Exclamation mark to enable Automatic Unset
```

### Style: Compact (harder to read but less code)

```js
TODO: Add this once the verbose example is complete
```

## HASM Projects

Create a `config.hasm` to treat certain `.hasm` files as part of a housing project.

You can then write a script that acts like a house boilerplate:

```js
@scope('function', 'Do stuff') // Create a function 'Do stuff'
@set('Edit Icon', @item('filePath', x=$x)) // Set the function's item icon
@set('Automatic Execution', 20) // Make the function execute every 20 ticks

player.x = 1 // Create a 'Change Variable' action inside of the function

@scope('house')
@set('daylight cycle', true)
@set('house name', '&c&lMy Housing Project')

player.x = 1 // Error: cannot create actions inside scope 'house'

@scope('group', 'Noob') // Create new 'Noob' group and set the scope to it
@set('default')
@set('tag', 'NOOB')
@set('tag shows in chat', true)
@set('color', Green)
@set('priority', 1)

@set('permission', Fly, false)
```

Inside `./filePath.json`:

```js
import x from 'args'
$x = x
export {Item:"minecraft:{x}"}
```

## Docs & Scripting Guide

Check out the docs to learn how to write **HASM scripts**.
[In the making](null)

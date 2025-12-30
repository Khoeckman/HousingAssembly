# Housing Assembly (HASM)

A ChatTriggers module to automate the creation of **Hypixel Housing projects** trough a custom programming language (`.hasm`).

Because Hypixel only provides **limited scripting capabilities** (no for-loops, condition nesting, inline arithmetic expressions) and it is a slow item clicking process, this module helps save a ton of time by making ChatTriggers do the clicking, turning textual code into Housing actions and settings.

Using an editor like **VSCode** makes it very easy to write **HASM projects** and scan large portions of code at once to **find bugs** using built-in function like Find All (`Ctrl+Shift+F`).

## Installation

1. Install [ChatTriggers 2.2.1](https://github.com/ChatTriggers/ChatTriggers/releases/tag/2.2.1)
2. Download `Source code.zip` from [Releases](https://github.com/Khoeckman/HousingAssembly/releases/latest)
3. Extract `Source code.zip` into `%appdata%/.minecraft/config/ChatTriggers/modules/HousingAssembly/`
4. Make sure the `metadata.json` file is located at `%appdata%/.minecraft/config/HousingAssembly/modules/ChatSocket/metadata.json`
5. Reload all ChatTrigger modules with `/ct load`.
6. In chat should appear: `[HASM] Module Loaded. Type "/hasm" for help.`

## Docs & Scripting Guide

Refer to the documentation to learn how to write **HASM scripts**.

> 🚧 Docs are **under construction** and will be published as soon as its useable enough.
> I'm using VitePress.

## HASM Scripts

To let **HASM** know what to do and where to do it you must feed it a `*.hasm` file.
Inside of such files you can write **HASM code** which is a custom programming language fitted for Housing.

Below is an overview explaining a broad amount of features and edge cases.

```js
// This is required to use cancelEvent()
@scope('event', 'Player Block Break')

// Types: Long, Double, String, Unset (L, D, S, U)
#define vg.x <D> // Define vg.x as: Double
#define vg.y <D?> // Define vg.y as: Double or Unset

if [
  not blockType(@item('fileName'), matchTypeOnly=true)
  vp.x < vg.x ?? 1.0 // Uses 1.0 if g.x is Unset
  // conditions...
] any {
  // actions...
} else {
  // actions...
}

cancelEvent()

vp.name = 'Mike'
vp.lore = `Hello, ${vp.name}`

// Works like Python's range() enumerator.
#for ${i} in (10, 0, -2) { // i -> 10, 8, 6, 4, 2
  vp.varName${i} += ${10 * i}
}

vp.x = 2
vp.x *= vp.x
vp.x += random.whole(1, 20)

// Ambiguity between variable and placeholder
vp.name = vp.name // %var.player/name% (variable)
vp.name = player.name // %player.name% (placeholder)

vg.x += vp.x // TypeError: Cannot combine Double and Long. Did you forget to cast 'player.x' to a Double?
vg.x += (D) vp.x ?? 0 // %var.player.x/0%D
vg.x += (D) vp.x(0) // %var.player.x/0%D
vg.x += vp.x(0)<D> // %var.player.x/0%D

vp.x~ // Unset

vp.text = vp.x! // Exclamation mark to disable Automatic Unset
vp.text = vp.x~ // Exclamation mark to enable Automatic Unset
```

## HASM Projects

Create a `config.hasm` to treat certain `.hasm` files as part of a housing project.

You can then write a script that acts like a house boilerplate:

```js
$name = 'stone'

@scope('function', 'Do stuff') // Create a function 'Do stuff'
@set('Edit Icon', @item('filePath', name=${name})) // Set the function's item icon
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
$name := 'iron_ingot' // := only assignes if it's undefined
export {Item:"minecraft:${name}"}
```

## Development Setup

This project uses **Vite** to compile TypeScript to JavaScript.
Follow the steps below to run the project locally, make changes, or work on a fork.

### Install dependencies

Install all required devDependencies using npm:

```shell
npm install
```

### Development mode (watch)

Start the TypeScript compiler in watch mode with Vite:

```shell
npm run dev
```

This will automatically rebuild the project when files change.

### Build once

To generate a production build without watching:

```shell
npm run build
```

### Output

The compiled output is written to `dist/index.js`.
This is the file consumed by ChatTriggers.

### Configuration

Build and compilation behavior are configured in:

- `tsconfig.json` — TypeScript compiler settings
- `vite.config.js` — Vite build configuration
  These files can be adjusted if you need custom paths, output formats, or build behavior.

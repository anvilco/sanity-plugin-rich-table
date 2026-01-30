# Rich table plugin for Sanity

## Features
- 100% Typescript
- Rich table schema type `richTable` with Portable Text based cells
- Portable Text block type `richTableBlock`
- Portable Text editor goodies like Slash commands, Markdown shortcuts and emoji picker - thanks to the amazing work of Christian Groengaard!
- Optional row and column titles
- Expandable table dialog 
- Advanced row and column menus (move, delete, add new inline)


## Installation

```sh
npm install sanity-plugin-rich-table
```

## Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {richTablePlugin} from 'sanity-plugin-rich-table'

export default defineConfig({
  //...
  plugins: [richTablePlugin({})],
})
```
After installing the plugin, you can use the `richTable` object type in your schemas as a field (object) or the `richTableBlock` type in your Portable Text fields.

### Usage as field

```ts
 defineField({
   name: 'myRichTable',
   title: 'My Rich Table',
   type: 'richTable', // Use the rich table object type
 })
```

### Usage as custom block in Portable Text

```ts
 // in the portable text schema
 defineArrayMember({
   name: 'richTableBlock',
   title: 'Rich Table Block',
   type: 'richTableBlock', // Use the rich table block type
 })
 ```


## Features coming

- More customization options for table styles and behaviors
- Additional cell types and content options
- Improved performance for large tables
- Enhanced accessibility features

## License

[MIT](LICENSE) © Saskia Bobinska

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

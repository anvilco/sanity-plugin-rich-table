# Rich table plugin for Sanity

_**THIS PACKAGE IS NOT YET RELEASED! YOU CANNOT INSTALL IT YET!**_

The last rich table plugin for Saniyt you will need!

<img width="1051" height="387" alt="Screenshot 2026-01-30 at 20 17 38" src="https://github.com/user-attachments/assets/447bbd97-2edd-442a-aca2-6d53c330ad91" />

## Features

- 100% Typescript
- Initialise a table with intuitive table selection by click or drag
- Rich table schema type `richTable` with Portable Text based cells
- Portable Text block type `richTableBlock`
- Portable Text editor goodies like Slash commands, Markdown shortcuts, LinkPlugin and emoji picker - thanks to the amazing work of Christian Groengaard!
- Optional row and column titles
- Expandable table dialog
- Advanced row and column menus (move, delete, add new inline)
- Option to show table headers
- Unset table data with a button & confirmation dialog
- Dark and light mode support 😎

| <img width="578" height="263" alt="Preview of inline slash command" src="https://github.com/user-attachments/assets/ebef6b77-15bf-4142-833b-ed6bbd462039" /> |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Slash command picker on top of the toolbar                                                                                                                   |

| <img width="276" height="321" alt="Screenshot 2026-01-30 at 20 18 21" src="https://github.com/user-attachments/assets/fd7618dd-f7d8-4e20-8936-17ac002266ec" /> | <img width="298" height="278" alt="Screenshot 2026-01-30 at 20 18 28" src="https://github.com/user-attachments/assets/90121b59-8d25-48e1-9226-533f4ba47ba7" /> |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Column context menu                                                                                                                                            | Row context menu                                                                                                                                               |

## Installation

_**THIS PACKAGE IS NOT YET RELEASED! YOU CANNOT INSTALL IT YET!**_

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

## Render tables

Read more about rendering rich tables in your frontend application in the [Render tables](./docs/README.md#render-tables) guide.
In the docs you will find even more details about the [data structure](./docs/README.md#data-structure) used by this plugin.
And get a suggestion on how to [merge cells when rendering](./docs/README.md#merging-cells).

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

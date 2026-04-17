# copy-as-jira

Right-click an Inkdrop note and copy its body as Jira wiki markup.

## Features

Converts Markdown to Jira wiki notation:

| Markdown      | Jira                 |
| ------------- | -------------------- |
| `## Heading`  | `h2. Heading`        |
| `**bold**`    | `*bold*`             |
| `*italic*`    | `_italic_`           |
| `` `code` ``  | `{{code}}`           |
| ` ```js ``` ` | `{code:js}...{code}` |
| `- item`      | `* item`             |
| `1. item`     | `# item`             |
| `> quote`     | `{quote}...{quote}`  |
| `[text](url)` | `[text\|url]`        |
| `![alt](url)` | `!url!`              |
| Tables        | Jira table syntax    |

Headings deeper than h3 are demoted to h3 for readability.

## Install

```bash
ipm install copy-as-jira
```

## Usage

1. Right-click a note in the note list
2. Click **"Copy body as Jira"**
3. Paste into any Jira field (comment, description, etc.)

## Development

```bash
npm install
npm run build
ipm link --dev
```

Enable Development Mode in Inkdrop preferences, then reload.

## Test

```bash
npm test
```

## Publish

Inkdrop's current publishing flow uses the standalone IPM CLI.

```bash
npm install -g @inkdropapp/ipm-cli
ipm configure
ipm publish
```

This package is configured to build automatically during packing and publishing via `prepack`, and the published tarball is restricted to the compiled `lib/` output plus `menus/`.

To inspect the tarball locally before publishing:

```bash
npm pack --dry-run --cache /tmp/npm-cache
```

## License

MIT

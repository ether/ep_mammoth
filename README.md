![Publish Status](https://github.com/ether/ep_mammoth/workflows/Node.js%20Package/badge.svg) [![Backend Tests Status](https://github.com/ether/ep_mammoth/actions/workflows/test-and-release.yml/badge.svg)](https://github.com/ether/ep_mammoth/actions/workflows/test-and-release.yml)

# Mammoth DocX import Etherpad plugin

Tired of losing fidelity when importing those horrible Microsoft .docx files?  This plugin solves that. 

# Don't ignore blank paragraphs

Add the following to your settings.json

```
  "ep_mammoth":{
    "ignoreEmptyParagraphs": false
  }
```

## Installation

Install from the Etherpad admin UI (**Admin → Manage Plugins**,
search for `ep_mammoth` and click *Install*), or from the Etherpad
root directory:

```sh
pnpm run plugins install ep_mammoth
```

> ⚠️ Don't run `npm i` / `npm install` yourself from the Etherpad
> source tree — Etherpad tracks installed plugins through its own
> plugin-manager, and hand-editing `package.json` can leave the
> server unable to start.

After installing, restart Etherpad.

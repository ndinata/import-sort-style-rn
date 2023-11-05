> [!WARNING]
> This package has been deprecated in favour of https://github.com/IanVS/prettier-plugin-sort-imports.
> To achieve a sorting result with that package that is similar-ish to this one, you can use [this](https://github.com/ndinata/react-native-template-opinionated/blob/main/template/.prettierrc.json) as reference.

# import-sort-style-rn

Sensible [import sorting](https://github.com/renke/import-sort/) style for React Native projects.

## Usage

### Installation

```
yarn add --dev import-sort-cli import-sort-style-rn
```

### Setup

Add the following to your `package.json`:

```json
"importSort": {
  ".js, .jsx": {
    "parser": "babylon",
    "style": "rn"
  }
}
```

### Typescript

You can use a different parser for Typescript files. More info [here](https://github.com/renke/import-sort#using-a-different-style-or-parser).

```
yarn add --dev import-sort-parser-typescript
```

Add this to your `package.json`:

```diff
"importSort": {
  ".js, .jsx": {
    "parser": "babylon",
    "style": "rn"
  },
+ ".ts, .tsx": {
+   "parser": "typescript",
+   "style": "rn"
+ }
}
```

## Style

```javascript
// Modules with side effects (not sorted internally because order may matter)
// React (Native) modules
// Node.js modules
// Installed modules
import 'c';
import 'a';
import React from 'react';
import { Text, ... } from 'react-native';
import { readFile } from 'fs';
import axios from 'axios';

// Absolute project modules
// "External" project modules ("../")
// "Internal" project modules ("./")
import { padding } from 'theme';
import Divider from '../components/Divider';
import Bubble from './Bubble';
```

### References

- https://github.com/renke/import-sort/tree/master/packages/import-sort-style-module
- https://github.com/pietile/import-sort-style-pietile

function isResourceModule(imported) {
  const { moduleName } = imported;
  return (
    moduleName.endsWith('.png') ||
    moduleName.endsWith('.svg') ||
    moduleName.endsWith('.jpg') ||
    moduleName.endsWith('.jpeg')
  );
}

function isReactModule(imported) {
  return imported.moduleName === 'react';
}

function isReactNativeModule(imported) {
  return imported.moduleName.startsWith('react-native');
}

function isInternalModule(imported) {
  return imported.moduleName.startsWith('./');
}

function isExternalModule(imported) {
  return imported.moduleName.startsWith('../');
}

function style(api, file) {
  const {
    alias,
    and,
    not,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isInstalledModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode,
  } = api;
  return [
    // import 'foo'
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },

    // import './foo'
    { match: and(hasNoMember, isRelativeModule) },
    { separator: true },

    // import React from 'react'
    // import { View, ... } from 'react-native'
    // import type { ViewStyleProp, ... } from 'react-native/**'
    { match: isReactModule, sortNamedMembers: alias(unicode) },
    { match: isReactNativeModule, sortNamedMembers: alias(unicode) },
    { separator: true },

    // import ... from 'fs' (Node modules)
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import ... from 'foo'
    {
      match: isInstalledModule(file),
      sort: moduleName(unicode),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import ... from '../projectFoo' (non-resource)
    {
      match: and(isExternalModule, not(isResourceModule)),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import ... from './projectFoo' (non-resource)
    {
      match: and(isInternalModule, not(isResourceModule)),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import image from '**/foo.png'
    {
      match: isResourceModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
  ];
}

module.exports = style;

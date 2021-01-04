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
  return (
    imported.moduleName === 'react-native' ||
    imported.moduleName.startsWith('react-native/')
  );
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
    // import './foo'
    { match: and(hasNoMember, isAbsoluteModule) },
    { match: and(hasNoMember, isRelativeModule) },

    // import React from 'react'
    // import ... from 'react-native/**'
    // import ... from 'fs' (Node modules)
    // import ... from 'foo'
    { match: isReactModule, sortNamedMembers: alias(unicode) },
    { match: isReactNativeModule, sortNamedMembers: alias(unicode) },
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {
      match: isInstalledModule(file),
      sort: moduleName(unicode),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import ... from '../projectFoo' (non-resource)
    // import ... from './projectFoo' (non-resource)
    // import image from '**/foo.png'
    {
      match: and(isExternalModule, not(isResourceModule)),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    {
      match: and(isInternalModule, not(isResourceModule)),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    {
      match: isResourceModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
  ];
}

module.exports = style;

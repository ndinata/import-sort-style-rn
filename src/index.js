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
    // import React from 'react'
    // import ... from 'react-native/**'
    // import ... from 'fs' (Node modules)
    // import ... from 'foo' (installed/third-party dependency)
    { match: and(hasNoMember, isAbsoluteModule) },
    { match: and(hasNoMember, isRelativeModule) },
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

    // import ... from 'foo' (first-party module)
    // import ... from '../**/projectFoo'
    // import ... from './**/projectFoo'
    {
      match: and(not(isInstalledModule(file)), isAbsoluteModule),
      sort: moduleName(unicode),
      sortNamedMembers: alias(unicode),
    },
    {
      match: isExternalModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    {
      match: isInternalModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
  ];
}

module.exports = style;

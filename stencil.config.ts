import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'week-calendar-app',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  copy: [
    { src: 'global' }
  ]
};

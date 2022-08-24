// import Bugsnag from '@bugsnag/electron';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React from 'react';

import { createRoot } from 'react-dom/client';
import ListApp from './list/ListApp';

import './App.scss';
import { AppError } from './AppError';

Bugsnag.start({
  apiKey: '6029e7f07c1a2360d571557de7338d5f',
  plugins: [new BugsnagPluginReact()],
});

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary FallbackComponent={AppError}>
    <ListApp />
  </ErrorBoundary>
);

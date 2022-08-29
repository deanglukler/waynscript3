// import Bugsnag from '@bugsnag/electron';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React from 'react';

import { createRoot } from 'react-dom/client';

import '../../assets/mukta-font/mukta-fontface.css';
import './App.scss';
import { AppError } from './AppError';
import { MainWindow } from './MainWindow';

Bugsnag.start({
  apiKey: '6029e7f07c1a2360d571557de7338d5f',
  plugins: [new BugsnagPluginReact()],
});

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary FallbackComponent={AppError}>
    <MainWindow />
  </ErrorBoundary>
);

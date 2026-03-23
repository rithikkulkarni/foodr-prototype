import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { CreateSession } from './pages/CreateSession';
import { Confirm } from './pages/Confirm';
import { Group } from './pages/Group';
import { Vote } from './pages/Vote';
import { Results } from './pages/Results';

const appChildren = [
  { index: true, Component: Home },
  { path: 'create-session', Component: CreateSession },
  { path: 'confirm', Component: Confirm },
  { path: 'group', Component: Group },
  { path: 'vote', Component: Vote },
  { path: 'results', Component: Results },
] as const;

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: appChildren,
  },
  {
    path: '/foodr-prototype',
    Component: Root,
    children: appChildren,
  },
]);

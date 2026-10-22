import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('create', 'routes/create.tsx'),
  route('room', 'routes/room.tsx'),
  route('how-to-use', 'routes/how-to-use.tsx')
] satisfies RouteConfig;

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  // base is requierd for github pages to work
  // https://vitejs.dev/guide/static-deploy.html#github-pages
  // we are deploying to https://<USERNAME>.github.io/<REPO>/
  //  (eg. your repository is at https://github.com/<USERNAME>/<REPO>)
  //  so base should be '/<REPO>/'
  base: '/rote-rush',
  plugins: [tsconfigPaths(), react()],
});

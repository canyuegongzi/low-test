import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginLess } from '@rsbuild/plugin-less';

export default defineConfig({
  plugins: [pluginReact(), pluginSass(), pluginLess()],
});

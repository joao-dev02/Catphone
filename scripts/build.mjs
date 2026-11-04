import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
await build({
  entryPoints:['src/buttons.tsx'],
  outfile:'dist/assets/buttons.js',
  bundle:true,
  minify:true,
  format:'esm',
  target:['es2022'],
  define:{'process.env.NODE_ENV':'"production"'},
  legalComments:'none',
  tsconfig:'tsconfig.json',
});
const css=spawnSync(process.execPath,['node_modules/@tailwindcss/cli/dist/index.mjs','-i','src/buttons.css','-o','dist/assets/buttons.css','--minify'],{stdio:'inherit'});
if(css.status!==0)process.exit(css.status??1);

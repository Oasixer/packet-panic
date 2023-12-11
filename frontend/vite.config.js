import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// from https://dev.to/avxkim/setup-path-aliases-w-react-vite-ts-poa
// (the path aliases)
//
// also don't forget to `npm i -D @types/node`, so __dirname won't complain
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});

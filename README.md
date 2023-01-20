# rollup-plugin-typescript2-issue-433

### Repro for issue [443](https://github.com/ezolenko/rollup-plugin-typescript2/issues/433)

When running rollup.watch (programmatically) only the first build goes well. All the following builds result in the same output for .ts files. I've added a .js file and only that .js file gets changes on every re-build. None of the .ts files get an update after re-build.

Same for .vue files. When using <script setup lang="ts"> - it doesn't get updates after re-builds. When using <script setup> - works fine. But I guess there is a single cause for both.

### Update:
When `rollup-plugin-typescript2` plugin option `check` is set to `false` both (ts and vue) files fail to update.
When `rollup-plugin-typescript2` plugin option `check` is set to `true` only vue file fails to update.

# run repro

`npm i`
`npm run start`

# how to check

1. `npm run start`
2. first build goes well, you can see in console and in ./dist folder that it's fine
3. change something in one of the files `src/test.js`, `src/index.ts` or `src/app.vue`
4. check the re-build code: TS (and .vue with `lang="ts"`) files don't update
5. switch `check` to `true` in plugin config `scripts/build-watch.js`
6. stop running and perform step 1
7. perform step 3
8. now index.ts file gets an updates on each re-build, but vue file still gets the first version

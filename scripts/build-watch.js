/**
 * Reporduction of programmatical call of
 * rollup.watch with several plugins
 */

const rollup = require('rollup')
const ts = require('rollup-plugin-typescript2')
const nodeResolve = require('@rollup/plugin-node-resolve')
const vue = require('rollup-plugin-vue')
const { dye } = require('@prostojs/dye')

run()

async function run() {
    const opts = {
        input: './src/index.ts',
        output: {
            file: './dist/index.js',
        },
        external: [
            'vue',
        ],
        plugins: [
            nodeResolve(),
            ts({
                clean: true,
                check: false,
            }),
            vue(),
        ]
    }
    const watcher = rollup.watch(opts)

    watcher.on('event', async (data) => {
        if (data.code === 'BUNDLE_START') {
            out.step('-- bundle started')
        }
        if (data.code === 'ERROR') {
            const re = data.error
            out.step('-- rollup watch error')
            console.error(re)
            if (data.result) {
                void data.result.close()
            }
        }
        if (data.code === 'BUNDLE_END') {
            out.step('-- bundle ended\n')
            const { output } = await data.result.generate(opts.output)

            // logging the files content just to see the changes right in the console
            console.log(
                Object.entries(output[0].modules)
                    .filter(([path]) => path.endsWith('index.ts') || path.endsWith('test.js') || path.endsWith('app.vue?vue&type=script&setup=true&lang.ts'))
                    .map(([path, data]) => [path.split('/').pop(), data])
                    .map(([path, data]) => `${out.file(path)}:\n${out.code(data.code)}`).join('\n\n') + '\n'
            )

            // writting to FS also writing cached transpiled code
            await data.result.write(opts.output)
            await data.result.close()
        }
    })
}

const out = {
    step: dye('dim', 'gray05').attachConsole(),
    file: dye('yellow', 'bold'),
    code: dye('blue'),
}

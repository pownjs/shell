exports.yargs = {
    command: 'shell [options]',
    describe: 'Simple shell',

    handler: async(argv) => {
        const { file } = argv

        const readline = require('readline')
        const { execute } = require('@pown/cli')
        const { extract } = require('@pown/modules')

        const { loadableModules, loadableCommands } = await extract()

        const options = {
            loadableModules: loadableModules,
            loadableCommands: loadableCommands,

            inlineCommands: [
                require('@pown/script/lib/commands/subcommands/echo')
            ]
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'pown > '
        })

        rl.prompt()

        rl.on('line', async(data) => {
            const line = data.toString().trim()

            if (!line || line.startsWith('#')) {
                return
            }

            await execute(line, options)

            rl.prompt()
        })
    }
}

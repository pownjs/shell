exports.yargs = {
    command: 'shell [options]',
    describe: 'Simple shell',

    handler: async(argv) => {
        const { execute } = require('@pown/cli')
        const { extract } = require('@pown/modules')

        const { loadableModules, loadableCommands } = await extract()

        const { subcommands } = require('@pown/script/lib/commands/subcommands')

        const executeOptions = {
            loadableModules: loadableModules,
            loadableCommands: loadableCommands,

            inlineCommands: subcommands
        }

        const readline = require('readline')

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'pown > ',
            terminal: true
        })

        const originalExit = process.exit

        process.exit = function(...args) {}

        const exit = (code) => {
            process.exit = originalExit

            process.exit(code)
        }

        rl.prompt()

        for await (let line of rl) {
            line = line.trim()

            if (!line || line.startsWith('#')) {
                rl.prompt()

                continue
            }

            try {
                await execute(line, executeOptions)
            }
            catch (e) {
                if (e.exitCode) {
                    console.warn(e.message)

                    return exit(e.exitCode)
                }
                else {
                    console.error(e)
                }
            }

            prompt: rl.prompt()
        }

        return exit(0)
    }
}

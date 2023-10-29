const { spawnSync } = require('child_process')

/**
 *
 * @param {string} command
 * @param {Omit<SpawnSyncOptionsWithStringEncoding, 'encoding'>} [option]
 * @returns {string}
 */
function spawnExec (command, option) {
  const [cmd, ...args] = command.split(' ').map(item => item.trim()).filter(item => item)
  const res = spawnSync(cmd, args, { encoding: 'utf8', shell: true, ...option })
  return res.output.reverse().reduce((prev, curr) => prev + (curr ?? ''), '') ?? ''
}
exports.spawnExec = spawnExec

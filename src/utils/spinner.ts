import ora, { type Ora } from 'ora'
import Log from './log.js'

export async function showSpinner(
  operate: (spinner: Ora) => Promise<unknown>,
  messages: { start: string; succeed?: string; fail?: string },
  options?: { throw?: boolean; parseError?: (error: unknown) => Error; fail?: boolean; debug?: boolean },
) {
  const spinner = ora(messages.start).start()
  try {
    await operate(spinner)
    if (messages.succeed) spinner.succeed(messages.succeed)
  } catch (error) {
    if (messages.fail) spinner.fail(messages.fail)
    const err = options?.parseError?.(error) ?? (error as Error)
    if (options?.throw) throw err
    if (options?.fail) spinner.fail(err.message)
    if (options?.debug !== false) Log.debug(err.message)
  }
}

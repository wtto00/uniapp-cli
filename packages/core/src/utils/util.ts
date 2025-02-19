export async function safeAwait<T>(promise: Promise<T>): Promise<[null, T] | [Error, null]> {
  try {
    return [null, await promise]
  } catch (error) {
    return [error as Error, null]
  }
}

export function enumInclude<T>(data: Record<string, T>, value: T) {
  return Object.values(data).includes(value)
}

export type MaybePromise<T = void> = T | Promise<T>

export function uniRunSuccess(text: string) {
  return /ready in (\d+\.)?\d+m?s\./.test(text)
}

export function uniBuildDone(text: string) {
  return /DONE {2}Build complete\./.test(text)
}

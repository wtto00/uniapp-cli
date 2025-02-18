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

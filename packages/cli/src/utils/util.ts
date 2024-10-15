export function appendSet<T = string>(target: Set<T>, source?: Set<T>) {
  if (source) {
    for (const item of source) {
      target.add(item)
    }
  }
}

export function enumInclude<T>(data: Record<string, T>, value: T) {
  return Object.values(data).includes(value)
}

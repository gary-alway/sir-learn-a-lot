export const removePrefix = (id: string, prefix: string): string =>
  id.replace(prefix, '')

export const addPrefix = (id: string, prefix: string): string =>
  `${prefix}${removePrefix(id, prefix)}`

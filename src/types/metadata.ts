export type Version = `${string}.${string}.${string}`

export interface MetadataJson {
  name: string
  creator: string
  description: string
  version: Version
  entry: string
  homepage: string
  remote: string
}

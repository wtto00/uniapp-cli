declare namespace NodeJS {
  interface Process {
    uniappVerbose?: boolean
  }
}

declare module 'download-git-repo' {
  interface Options {
    clone?: boolean
    headers?: Record<string, string>
  }
  function download (repo: string, dest: string, opts: Options): string
  function download (repo: string, dest: string, opts: Options, cb: (err?: Error) => void): string

  export = download
}

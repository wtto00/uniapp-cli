declare module 'download-git-repo' {
  import download from 'download';
  import clone from 'git-clone';

  interface Options extends clone.Options, download.DownloadOptions {
    clone?: boolean;
    headers?: Record<string, string>;
  }
  type Callback = (err?: Error) => void;
  export default function download(repo: string, dest: string, opts?: Options | Callback, fn?: Callback): void;
}

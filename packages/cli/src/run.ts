export interface RunOptions {
  debug?: boolean;
  release?: boolean;
  device?: boolean;
  emulator?: boolean;
  list?: boolean;
  target?: string;
}

export function run(platform: string, options: RunOptions) {
  console.log(platform, options);
}

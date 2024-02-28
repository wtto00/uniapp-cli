namespace NodeJS {
  interface Process {
    Log: import("@uniapp-cli/common").Log;
  }
}

interface ImportMeta {
  env: NodeJS.Process["env"];
}

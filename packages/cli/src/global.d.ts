namespace NodeJS {
  interface Process {
    Log: import("@uniapp-cli/common").Log;
  }
}

interface ImportMeta {
  env: NodeJS.Process["env"];
}

module "uniapp-android" {
  const run: import("../../android");
  export default run;
}

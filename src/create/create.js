const types = {
  stable: {
    label: "正式版",
    description: "对应HBuilderX最新正式版",
    cmd: "vue create -p dcloudio/uni-preset-vue",
  },
  alpha: {
    label: "alpha版",
    description: "对应HBuilderX最新alpha版",
    cmd: "vue create -p dcloudio/uni-preset-vue",
  },
  vite: {
    label: "Vue3/Vite版",
    cmd: "degit dcloudio/uni-preset-vue#vite",
  },
  "vite-ts": {
    label: "Vue3/Vite/TS版",
    cmd: "degit dcloudio/uni-preset-vue#vite-ts",
  },
};

/**
 * create uniapp project
 * @param {string[]} options
 */
module.exports = async function create(options) {
  let { name, uniappType, args } = parseOptions(options);
  const promptsOptions = [];
  if (!uniappType) {
    const choices = Object.keys(types).map((key) => ({
      title: types[key].label,
      description: types[key].description,
      value: key,
    }));
    const defaultChoiceIndex = choices.findIndex(
      (item) => item.value === "vite-ts"
    );
    promptsOptions.push({
      type: "select",
      name: "uniappType",
      message: "请选择项目模板类型",
      choices: choices,
      initial: defaultChoiceIndex,
    });
  }
  if (!name) {
    promptsOptions.push({
      type: "text",
      name: "name",
      message: "请输入项目名称",
      initial: "uni-preset-vue",
    });
  }
  if (promptsOptions.length > 0) {
    const prompts = require("prompts");
    res = await prompts(promptsOptions);
    if (res.name) name = res.name;
    if (res.uniappType) uniappType = res.uniappType;
  }
  const { execShell } = require("../util");
  const { cmd } = types[uniappType];
  if (uniappType === "stable" || uniappType === "alpha") {
    execShell(`npx ${cmd} ${name} ${args.join(" ")}`);
  }
};

/**
 * 解析参数
 * @param {string[]} options 参数
 * @returns
 */
function parseOptions(options) {
  let name = "";
  let uniappType = "";
  let args = [];
  if (options.length > 0) {
    if (types[options[0]]) {
      uniappType = options[0];
      if (options[1]) {
        if (!options[1].startsWith("-")) {
          name = options[1];
          args = options.slice(2);
        } else {
          args = options.slice(1);
        }
      }
    } else if (!options[0].startsWith("-")) {
      name = options[0];
      args = options.slice(1);
    } else {
      args = options;
    }
  }
  return { name, uniappType, args };
}

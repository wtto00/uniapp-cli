export function generateSpace(space = 4) {
  const spaceStr = SPACE[space / 4];
  if (spaceStr) return spaceStr;
  return Array.from(Array(space + 1)).join(" ");
}

export const SPACE: Record<number, string> = {
  1: "    ",
  2: "        ",
  3: "            ",
  4: "                ",
};

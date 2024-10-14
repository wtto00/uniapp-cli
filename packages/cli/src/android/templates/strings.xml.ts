import { generateSpace } from "../../utils/space";

export type Strings = Record<string, string>;

export function genderateStrings(strings: Strings) {
  const stringsXML: string[] = [];
  for (const name in strings) {
    stringsXML.push(`<string name="${name}">${strings[name]}</string>`);
  }
  return `<resources>
    ${stringsXML.join(`\n${generateSpace(4)}`)}
</resources>`;
}

import { FormatOptions } from "./FormatOptions";
import { Part } from "./Part";
import { Path } from "./Path";



export class Template {
  constructor(
    private template: { raw: readonly string[] | ArrayLike<string>; },
    private substitutions: Part[]
  ) { }

  renderParts(group: Record<string, string>, options: FormatOptions): Path[] {
    const partialParts: Path[] = [];

    const len = Math.max(this.template.raw.length, this.substitutions.length);

    for (let i = 0; i < len; i++) {
      const raw = this.template.raw[i];
      const substitution = this.substitutions[i];

      if (raw) {
        partialParts.push({ type: "literal", value: raw });
      }

      if (substitution) {
        partialParts.push(...substitution.render(group, options));
      }
    };
    return partialParts;
  }

}


export const template = (
  template: { raw: readonly string[] | ArrayLike<string> },
  ...substitutions: Part[]
) => new Template(template, substitutions);

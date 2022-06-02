import { FormatOptions } from "./FormatOptions";
import { Path } from "./Path";
import { TypePart } from "./TypePart";
export class Part {
  constructor(
    readonly type: TypePart,
    private value: string | ((group: Record<string, string>, options: FormatOptions) => string | Path[])
  ) { }

  render(group: Record<string, string>, options: FormatOptions): Path[] {
    if (typeof this.value === "function") {
      const valueRender = this.value(group, options);
      if (Array.isArray(valueRender))
        return valueRender;
      return [{ type: this.type, value: valueRender }];
    }

    return [{ type: this.type, value: this.value }];
  }
}

export const part = (
  type: TypePart,
  value: string | ((group: Record<string, string>, options: FormatOptions) => string)
) => new Part(type, value);

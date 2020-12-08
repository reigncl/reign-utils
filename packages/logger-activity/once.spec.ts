import { once } from "./once";
import { strictEqual } from "assert";

describe("once", () => {
  it("cache evaluation", () => {
    const fn = once((n: number) => [n, Math.random()]);

    const a1 = fn(1);
    const a2 = fn(2);
    const a3 = fn(3);

    strictEqual(a1, fn(1));
    strictEqual(a2, fn(2));
    strictEqual(a3, fn(3));
    strictEqual(a1, fn(1));
    strictEqual(a1, fn(1));
  });

  it("cache custom key", () => {
    const fn = once(
      (a: { n: number; t: number }) => [a.n, Math.random()],
      (a) => a.n
    );

    const a1 = fn({ n: 1, t: Math.random() });
    const a2 = fn({ n: 2, t: Math.random() });
    const a3 = fn({ n: 3, t: Math.random() });

    strictEqual(a1, fn({ n: 1, t: Math.random() }));
    strictEqual(a2, fn({ n: 2, t: Math.random() }));
    strictEqual(a3, fn({ n: 3, t: Math.random() }));
    strictEqual(a1, fn({ n: 1, t: Math.random() }));
    strictEqual(a1, fn({ n: 1, t: Math.random() }));
  });
});

import { Mechanics } from "./mechanics";
import { discount } from "./mechanics-expressions";
import { template } from "./Template";

describe("Mechanics", () => {
  it("should expect error in parseToParts", () => {
    expect(() => new Mechanics().formatToParts("99", "2000")).toThrow();
    expect(() => new Mechanics().formatToParts("2", "2000")).toThrow();
  })

  it("format MechanicsId 1", () => {
    let mechanics = new Mechanics();

    expect(mechanics.format("1", "40")).toBe("40% Descuento");
    expect(mechanics.formatToParts("1", "40")).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "discount",
          "value": "40",
        },
        Object {
          "type": "percentSign",
          "value": "%",
        },
        Object {
          "type": "literal",
          "value": " Descuento",
        },
      ]
    `);
  });

  it("should format the mechanicid 4", () => {
    let mechanics = new Mechanics();

    expect(mechanics.format("4", "10")).toBe("$10");
    expect(mechanics.formatToParts("4", "10")).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "currency",
          "value": "$",
        },
        Object {
          "type": "integer",
          "value": "10",
        },
      ]
    `);
  });

  it("format MechanicsId 4", () => {
    let mechanics = new Mechanics();

    expect(mechanics.format("4", "10*100")).toBe("$10 Antes: $100");
    expect(mechanics.formatToParts("4", "10*100")).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "currency",
          "value": "$",
        },
        Object {
          "type": "integer",
          "value": "10",
        },
        Object {
          "type": "literal",
          "value": " Antes: ",
        },
        Object {
          "type": "currency",
          "value": "$",
        },
        Object {
          "type": "integer",
          "value": "100",
        },
      ]
    `);
  });

  it("format MechanicsId 13", () => {
    let mechanics = new Mechanics();

    expect(mechanics.format("13", "Por una compra sobre $100")).toBe("Por una compra sobre $100");
    expect(mechanics.formatToParts("13", "Por una compra sobre $100")).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "input",
          "value": "Por una compra sobre $100",
        },
      ]
    `);
  });

  it("format MechanicsId 11", () => {
    let mechanics = new Mechanics();

    expect(mechanics.format("11", "10*100")).toBe("$10 Por una compra sobre $100");
    expect(mechanics.formatToParts("11", "10*100")).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "currency",
          "value": "$",
        },
        Object {
          "type": "integer",
          "value": "10",
        },
        Object {
          "type": "literal",
          "value": " Por una compra sobre ",
        },
        Object {
          "type": "currency",
          "value": "$",
        },
        Object {
          "type": "integer",
          "value": "100",
        },
      ]
    `);
  });

  it("should MechanicsId 2", () => {
    let mechanics = new Mechanics();

    expect(mechanics.format("2", "3*2")).toBe("3x2");
    expect(mechanics.formatToParts("2", "3*2")).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "nProducts",
          "value": "3",
        },
        Object {
          "type": "literal",
          "value": "x",
        },
        Object {
          "type": "m",
          "value": "2",
        },
      ]
    `);
  });

  it("should MechanicsId 7", () => {
    let mechanics = new Mechanics();

    expect(mechanics.format("7", "4*890")).toBe("4 x $890");
    expect(mechanics.formatToParts("7", "4*890")).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "nProducts",
          "value": "4",
        },
        Object {
          "type": "literal",
          "value": " x ",
        },
        Object {
          "type": "currency",
          "value": "$",
        },
        Object {
          "type": "integer",
          "value": "890",
        },
      ]
    `);
  });

  it("should use custom options", () => {
    let mechanics = new Mechanics("es-CL", {
      currencyFormat: {
        currency: "USD",
      },
    });

    expect(mechanics.format("11", "10*100")).toBe("US$10,00 Por una compra sobre US$100,00");
    expect(mechanics.formatToParts("11", "10*100")).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "currency",
          "value": "US$",
        },
        Object {
          "type": "integer",
          "value": "10",
        },
        Object {
          "type": "decimal",
          "value": ",",
        },
        Object {
          "type": "fraction",
          "value": "00",
        },
        Object {
          "type": "literal",
          "value": " Por una compra sobre ",
        },
        Object {
          "type": "currency",
          "value": "US$",
        },
        Object {
          "type": "integer",
          "value": "100",
        },
        Object {
          "type": "decimal",
          "value": ",",
        },
        Object {
          "type": "fraction",
          "value": "00",
        },
      ]
    `);
  });

  describe("style mobile-alvi", () => {

    it("should format mechanics 11", () => {
      const mechanic = new Mechanics("es-CL", { style: "mobile-alvi" });

      expect(mechanic.format("11", "15000*125000")).toBe("$15.000 de descuento\nPor compras sobre $125.000");
      expect(mechanic.formatToParts("11", "15000*125000")).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "currency",
            "value": "$",
          },
          Object {
            "type": "integer",
            "value": "15",
          },
          Object {
            "type": "group",
            "value": ".",
          },
          Object {
            "type": "integer",
            "value": "000",
          },
          Object {
            "type": "literal",
            "value": " de descuento",
          },
          Object {
            "type": "new_line",
            "value": "
        ",
          },
          Object {
            "type": "literal",
            "value": "Por compras sobre ",
          },
          Object {
            "type": "currency",
            "value": "$",
          },
          Object {
            "type": "integer",
            "value": "125",
          },
          Object {
            "type": "group",
            "value": ".",
          },
          Object {
            "type": "integer",
            "value": "000",
          },
        ]
      `);
    })

  });
});

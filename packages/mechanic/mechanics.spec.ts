import { Mechanics } from "./mechanics";

describe("Mechanics", () => {
  it("should check the valid mechanic id values", () => {
    expect(Mechanics.isValidMechanicsId("1")).toBe(true);
    expect(Mechanics.isValidMechanicsId("4")).toBe(true);
    expect(Mechanics.isValidMechanicsId("12")).toBe(false);
    expect(Mechanics.isValidMechanicsId("13")).toBe(true);
    expect(Mechanics.isValidMechanicsId("99")).toBe(false);
  });

  it("should check the valid mechanics text values", () => {
    expect(Mechanics.isValidMechanics("1", "10")).toBe(true);
    expect(Mechanics.isValidMechanics("2", "2000")).toBe(false);
    expect(Mechanics.isValidMechanics("4", "12")).toBe(true);
    expect(Mechanics.isValidMechanics("4", "12*200")).toBe(true);
    expect(Mechanics.isValidMechanics("4", "12*200*4000")).toBe(false);
    expect(Mechanics.isValidMechanics("7", "")).toBe(false);
  });

  it("should expect error in parseToParts", () => {
    expect(() => Mechanics.parseToParts("99", "2000")).toThrow();
    expect(() => Mechanics.parseToParts("2", "2000")).toThrow();
  })

  it("format MechanicsId 1", () => {
    let mechanics = new Mechanics("1", "40");

    expect(mechanics.format()).toBe("40% Descuento");
    expect(mechanics.formatToParts()).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "discount",
          "value": "40%",
        },
        Object {
          "type": "literal",
          "value": " Descuento",
        },
      ]
    `);
  });

  it("should format the mechanicid 4", () => {
    let mechanics = new Mechanics("4", "10");

    expect(mechanics.format()).toBe("$10");
    expect(mechanics.formatToParts()).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "offer",
          "value": "$10",
        },
      ]
    `);
  });

  it("format MechanicsId 4", () => {
    let mechanics = new Mechanics("4", "10*100");

    expect(mechanics.format()).toBe("$10 Antes: $100");
    expect(mechanics.formatToParts()).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "offer",
          "value": "$10",
        },
        Object {
          "type": "literal",
          "value": " Antes: ",
        },
        Object {
          "type": "ref",
          "value": "$100",
        },
      ]
    `);
  });

  it("format MechanicsId 13", () => {
    let mechanics = new Mechanics("13", "Por una compra sobre $100");

    expect(mechanics.format()).toBe("Por una compra sobre $100");
    expect(mechanics.formatToParts()).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "literal",
          "value": "Por una compra sobre $100",
        },
      ]
    `);
  });

  it("format MechanicsId 11", () => {
    let mechanics = new Mechanics("11", "10*100");

    expect(mechanics.format()).toBe("$10 Por una compra sobre $100");
    expect(mechanics.formatToParts()).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "discountAmount",
          "value": "$10",
        },
        Object {
          "type": "literal",
          "value": " Por una compra sobre ",
        },
        Object {
          "type": "minimumAmount",
          "value": "$100",
        },
      ]
    `);
  });

  it("should MechanicsId 2", () => {
    let mechanics = new Mechanics("2", "3*2");

    expect(mechanics.format()).toBe("3x2");
    expect(mechanics.formatToParts()).toMatchInlineSnapshot(`
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
    let mechanics = new Mechanics("7", "4*890");

    expect(mechanics.format()).toBe("4 x $890");
    expect(mechanics.formatToParts()).toMatchInlineSnapshot(`
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
          "type": "m",
          "value": "$890",
        },
      ]
    `);
  });

  it("should get styles", () => {
    const style = Mechanics.getStyle("1");

    expect(style).toMatchInlineSnapshot(`
      Array [
        Object {
          "exp": /\\^\\(\\?<discount>\\\\d\\+\\)\\$/,
          "parts": Array [
            Object {
              "type": "discount",
              "value": [Function],
            },
            Object {
              "type": "literal",
              "value": " Descuento",
            },
          ],
        },
      ]
    `);
  });

  it("should get styles with a custom style", () => {
    Mechanics.defineStyle("1", null, "custom", [
      { type: "literal", value: "Tienes un " },
      { type: "discount", value: ({ discount }) => `${discount}%` },
      { type: "literal", value: " de descuento" },
    ]);

    const style = Mechanics.getStyle("1");

    expect(style).toMatchInlineSnapshot(`
      Array [
        Object {
          "exp": /\\^\\(\\?<discount>\\\\d\\+\\)\\$/,
          "parts": Object {
            "custom": Array [
              Object {
                "type": "literal",
                "value": "Tienes un ",
              },
              Object {
                "type": "discount",
                "value": [Function],
              },
              Object {
                "type": "literal",
                "value": " de descuento",
              },
            ],
            "default": Array [
              Object {
                "type": "discount",
                "value": [Function],
              },
              Object {
                "type": "literal",
                "value": " Descuento",
              },
            ],
          },
        },
      ]
    `);
  });

  it("should render custom style", () => {
    Mechanics.defineStyle("1", null, "custom", [
      { type: "literal", value: "Tienes un " },
      { type: "discount", value: ({ discount }) => `${discount}%` },
      { type: "literal", value: " de descuento" },
    ]);

    let mechanics = new Mechanics("1", "40", { style: "custom" });

    expect(mechanics.format()).toBe("Tienes un 40% de descuento");
    expect(mechanics.formatToParts()).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "literal",
          "value": "Tienes un ",
        },
        Object {
          "type": "discount",
          "value": "40%",
        },
        Object {
          "type": "literal",
          "value": " de descuento",
        },
      ]
    `);
  });

  it("should use custom options", () => {
    let mechanics = new Mechanics("11", "10*100", {
      currencyFormat: {
        currency: "USD",
      },
    });

    expect(mechanics.format()).toBe("US$10,00 Por una compra sobre US$100,00");
    expect(mechanics.formatToParts()).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "discountAmount",
          "value": "US$10,00",
        },
        Object {
          "type": "literal",
          "value": " Por una compra sobre ",
        },
        Object {
          "type": "minimumAmount",
          "value": "US$100,00",
        },
      ]
    `);
  })
});

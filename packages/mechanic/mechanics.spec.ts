import { Mechanics } from "./mechanics";

describe("Mechanics", () => {
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
});

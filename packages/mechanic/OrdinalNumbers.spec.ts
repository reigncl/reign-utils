import { OrdinalNumbers } from "./OrdinalNumbers"

describe("Ordinal Numbers", () => {

  describe("should throw errors", () => {
    it("number too long", () => {
      expect(() => new OrdinalNumbers({style: 'short'}).format('12345')).toThrow();
    })
    it("text inpuit", () => {
      expect(() => new OrdinalNumbers({style: 'short'}).format('test')).toThrow();
    })
  })

  describe("ended with 0", () => {
    it("0 units short format", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short'});
      expect(ordinalNumbers.format('0')).toBe(`0ro`);
      expect(ordinalNumbers.formatToParts('0')).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "amount",
            "value": "0",
          },
          Object {
            "type": "suffix",
            "value": "ro",
          },
        ]
      `);
    })
    it("0 units long format", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'long'});
      expect(ordinalNumbers.format('0')).toBe(`cero`);
      expect(ordinalNumbers.formatToParts('0')).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "unit",
            "value": "cero",
          },
        ]
      `);
    })
    it("tens short format", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short'});
      const num = '10';
      const numOrdinal = "mo"
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "amount",
            "value": "10",
          },
          Object {
            "type": "suffix",
            "value": "mo",
          },
        ]
      `);
    })
    it("tens long format", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'long'});
      const num = '10';
      const numOrdinal = "décimo"
      expect(ordinalNumbers.format(num)).toBe(`${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "tens",
            "value": "décimo",
          },
        ]
      `);
    })
    it("hundreds short format", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short'});
      const num = '100';
      const numOrdinal = "mo"
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "amount",
            "value": "100",
          },
          Object {
            "type": "suffix",
            "value": "mo",
          },
        ]
      `);
    })
    it("hundreds long format", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'long'});
      const num = '100';
      const numOrdinal = "centésimo"
      expect(ordinalNumbers.format(num)).toBe(`${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "hundreds",
            "value": "centésimo",
          },
        ]
      `);
    })
    it("thousands short format", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short'});
      const num = '1000';
      const numOrdinal = "mo"
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "amount",
            "value": "1000",
          },
          Object {
            "type": "suffix",
            "value": "mo",
          },
        ]
      `);
    })
    it("thousands long format", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'long'});
      const num = '1000';
      const numOrdinal = "milésimo"
      expect(ordinalNumbers.format(num)).toBe(`${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "thousands",
            "value": "milésimo",
          },
        ]
      `);
    })
  })

  describe("long style, default noun", ()=>{
    it("should return one digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'long'});
      const num = '1';
      const numOrdinal = "primero"
  
      expect(ordinalNumbers.format(num)).toBe(numOrdinal);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "unit",
            "value": "primero",
          },
        ]
      `);
    });
    it("should return two digit ordinal", () => {
      let ordinalNumbers = new OrdinalNumbers({style: 'long'});
      const num = '12';
      const numOrdinal = "décimo segundo"
      expect(ordinalNumbers.format(num)).toBe(numOrdinal);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "tens",
            "value": "décimo",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "unit",
            "value": "segundo",
          },
        ]
      `);
    });
    it("should return three digit ordinal", () => {
      let ordinalNumbers = new OrdinalNumbers({style: 'long'});
      const num = '543';
      const numOrdinal = "quingentésimo cuadragésimo tercero"
      expect(ordinalNumbers.format(num)).toBe(numOrdinal);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "hundreds",
            "value": "quingentésimo",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "tens",
            "value": "cuadragésimo",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "unit",
            "value": "tercero",
          },
        ]
      `);
    });
    it("should return four digit ordinal", () => {
      let ordinalNumbers = new OrdinalNumbers({style: 'long'});
      const num = '9852';
      const numOrdinal = "noveno milésimo octingentésimo quincuagésimo segundo"
      expect(ordinalNumbers.format(num)).toBe(numOrdinal);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "thousands",
            "value": "noveno milésimo",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "hundreds",
            "value": "octingentésimo",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "tens",
            "value": "quincuagésimo",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "unit",
            "value": "segundo",
          },
        ]
      `);
    });
  })

  describe("long style, female noun", ()=>{
    it("should return one digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'long', noun: 'f'});
      const num = '1';
      const numOrdinal = "primera"
  
      expect(ordinalNumbers.format(num)).toBe(numOrdinal);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "unit",
            "value": "primera",
          },
        ]
      `);
    });
    it("should return two digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'long', noun: 'f'});
      const num = '12';
      const numOrdinal = "décima segunda"
      expect(ordinalNumbers.format(num)).toBe(numOrdinal);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "tens",
            "value": "décima",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "unit",
            "value": "segunda",
          },
        ]
      `);
    });
    it("should return three digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'long', noun: 'f'});
      const num = '543';
      const numOrdinal = "quingentésima cuadragésima tercera"
      expect(ordinalNumbers.format(num)).toBe(numOrdinal);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "hundreds",
            "value": "quingentésima",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "tens",
            "value": "cuadragésima",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "unit",
            "value": "tercera",
          },
        ]
      `);
    });
    it("should return four digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'long', noun: 'f'});
      const num = '9852';
      const numOrdinal = "noveno milésima octingentésima quincuagésima segunda"
      expect(ordinalNumbers.format(num)).toBe(numOrdinal);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "thousands",
            "value": "noveno milésima",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "hundreds",
            "value": "octingentésima",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "tens",
            "value": "quincuagésima",
          },
          Object {
            "type": "space",
            "value": " ",
          },
          Object {
            "type": "unit",
            "value": "segunda",
          },
        ]
      `);
    });
  })

  describe("short style, default noun", ()=>{
    it("should return one digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short'});
      const num = '1';
      const numOrdinal = "ro"
  
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "amount",
            "value": "1",
          },
          Object {
            "type": "suffix",
            "value": "ro",
          },
        ]
      `);
    });
    it("should return two digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short'});
      const num = '12';
      const numOrdinal = "do"
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "amount",
          "value": "12",
        },
        Object {
          "type": "suffix",
          "value": "do",
        },
      ]
      `);
    });
    it("should return three digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short'});
      const num = '543';
      const numOrdinal = "ro"
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "amount",
            "value": "543",
          },
          Object {
            "type": "suffix",
            "value": "ro",
          },
        ]
      `);
    });
    it("should return four digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short'});
      const num = '9852';
      const numOrdinal = "do"
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "amount",
            "value": "9852",
          },
          Object {
            "type": "suffix",
            "value": "do",
          },
        ]
      `);
    });
  })

  describe("short style, female noun", ()=>{
    it("should return one digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short', noun: 'f'});
      const num = '1';
      const numOrdinal = "ra"
  
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "amount",
            "value": "1",
          },
          Object {
            "type": "suffix",
            "value": "ra",
          },
        ]
      `);
    });
    it("should return two digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short', noun: 'f'});
      const num = '12';
      const numOrdinal = "da"
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "amount",
          "value": "12",
        },
        Object {
          "type": "suffix",
          "value": "da",
        },
      ]
      `);
    });
    it("should return three digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short', noun: 'f'});
      const num = '543';
      const numOrdinal = "ra"
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "amount",
            "value": "543",
          },
          Object {
            "type": "suffix",
            "value": "ra",
          },
        ]
      `);
    });
    it("should return four digit ordinal", () => {
      const ordinalNumbers = new OrdinalNumbers({style: 'short', noun: 'f'});
      const num = '9852';
      const numOrdinal = "da"
      expect(ordinalNumbers.format(num)).toBe(`${num}${numOrdinal}`);
      expect(ordinalNumbers.formatToParts(num)).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "amount",
            "value": "9852",
          },
          Object {
            "type": "suffix",
            "value": "da",
          },
        ]
      `);
    });
  })
});

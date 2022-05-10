# Mechanic

This library help to format the "mechanic text".

**Mechanics text Supported**

- 1: Ex. `20% Descuento`
- 4: Ex. `$10 Antes: $100`
- 13: Ex. `Por una compra sobre $100`
- 11: Ex. `$10 Por una compra sobre $100`
- 2: Ex. `2x3`
- 7: Ex. `4 x $890`


## API `Mechanics`

The `Mechanic` object format the "mechanical text".

**Example:**

```ts
// Format mechanics 1
let mechanics = new Mechanics("1", "40");

expect(mechanics.format()).toBe("40% Descuento");

// Format mechanics 4
let mechanics = new Mechanics("4", "10*100");

expect(mechanics.format()).toBe("$10 Antes: $100");
```

**Constructor** 

**``Mechanics(mechanicsId, mechanicsText)``**

Create a new `Mechanics` object.

**Syntax**

```ts
new Mechanics("4", "10*100")
```

**Parameters**

- `mechanicsId`: Type of mechanic to format. Posible values "`1`", "`4`", "`13`", "`11`", "`2`", "`7`".
- `mechanicsText`: Mechanic text to decompose. The format depends on the mechanic id. Ex. with the mechanic id `4` the mechanic text is `10*100`.


## `Mechanics.prototype.format()`

The `Mechanics.prototype.format()` method format the mechanic text.

**Syntax**

```ts
format()
```

**Return value**

A `string` of the mechanic formatted.

**Example**

```ts
const mechanicValue = new Mechanics("4", "10*100").format()

expect(mechanicValue).toBe("$10 Antes: $100")
```


## `Mechanics.prototype.formatToParts()`

The `Mechanics.prototype.formatToParts()` method format the mechanic text and return it in parts.

**Syntax**

```ts
formatToParts()
```

**Return value**

An `Array` of objects containing the formatted in parts. 

**Example**

```ts
[
    { "type": "offer", "value": "$10" },
    { "type": "literal", "value": " Antes: " },
    { "type": "ref", "value": "$100" },
]
```

Possible types are the following:

- `literal`: The string used for separating the values.
- `discount`:
- `discountAmount`:
- `m`:
- `minimumAmount`:
- `nProducts`:
- `offer`:
- `ref`:


## Custom Style `Mechanics.defineStyle(mechanicsId, expressionPos, styleName, parts)`

Use a custom style in the formatter with `Mechanics.defineStyle(mechanicsId, expressionPos, styleName, parts)`.

**Syntax**

```ts
Mechanics.defineStyle("1", null, "custom", template`Tienes un ${discount} de descuento`)
```

**Parameters**

- `mechanicsId`: Type of mechanic to format. Posible values "`1`", "`4`", "`13`", "`11`", "`2`", "`7`".
- `expressionPos`: If the mechanic has more expressions needs define the position (You can look at it with `Mechanics.getStyle`). If is `null` or `undefined` the position per default is `0`.
- `styleName`: Define a name to the style
- `parts`: An `Array` with the template part to format the `string` result.


**Sample**

```ts
let mechanics = new Mechanics("11", "10*100", {
    currencyFormat: {
        currency: "USD",
    },
});

expect(mechanics.format()).toBe("US$10,00 Por una compra sobre US$100,00");
```


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

**``Mechanics(locales, options)``**

Create a new `Mechanics` object.

**Syntax**

```ts
new Mechanics(undefined, { currencyFormat: { currency: "CLP" } })
```

**Parameters**

- `locales`: A string with a BCP 47 language tag, or an array of such strings.
- `options`: An object with some or all the following properties:
  - `style`: The formatting style to use. the default is `default`.
    - `"default"`: Generic formatting.
    - `"mobile-alvi"`: for the app mobile formatting.
  - `currencyFormat`: An object with the NumberFormat options. See more https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat.



## `Mechanics.prototype.format(mechanicsId, mechanicsText)`

The `Mechanics.prototype.format()` method format the mechanic text.

**Parameters**

- `mechanicsId`: Type of mechanic to format. Posible values "`1`", "`4`", "`13`", "`11`", "`2`", "`7`".
- `mechanicsText`: Mechanic text to decompose. The format depends on the mechanic id. Ex. with the mechanic id `4` the mechanic text is `10*100`.


**Syntax**

```ts
format("4", "10*100")
```

**Return value**

A `string` of the mechanic formatted.

**Example**

```ts
const mechanicValue = new Mechanics().format("4", "10*100")

expect(mechanicValue).toBe("$10 Antes: $100")
```


## `Mechanics.prototype.formatToParts(mechanicsId, mechanicsText)`

The `Mechanics.prototype.formatToParts()` method format the mechanic text and return it in parts.


**Parameters**

- `mechanicsId`: Type of mechanic to format. Posible values "`1`", "`4`", "`13`", "`11`", "`2`", "`7`".
- `mechanicsText`: Mechanic text to decompose. The format depends on the mechanic id. Ex. with the mechanic id `4` the mechanic text is `10*100`.



**Syntax**

```ts
formatToParts("4", "10*100")
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


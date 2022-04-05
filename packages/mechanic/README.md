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

**``Mechanics(string, string)``**

Create a new `Mechanics` object.

**Parameters**

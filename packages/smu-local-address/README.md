# SMU Local Address

Partial address list

# How to use

```ts
import localAddress from '@reignmodule/smu-local-address';

Object.keys(localAddress.formats) // [ 'UNIMARC', 'OK MARKET', 'MAYORISTA 10', 'ALVI' ]
```

```ts
import localAddress from '@reignmodule/smu-local-address/unimarc';

Object.keys(localAddress.formats) // [ 'UNIMARC' ]
```

## Model `Local`

```ts
interface Local {
    storeId: string;
    format: 'UNIMARC' | 'OK MARKET' | 'MAYORISTA 10' | 'ALVI';
    name: string;
    address: string;
    location: string;
    region: string;
}
```


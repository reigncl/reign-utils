import flatten from 'lodash.flatten';

const ALL = Symbol('ALL');

interface LocalAddressOptions {
  loads?: LocalObject[][];
}

interface LocalObject {
  storeId: string;
  Formato: string;
  address: string;
  comuna: string;
  region: string;
}

class LocalAddress {
  locals = new Map<LocalObject['storeId'], LocalObject>();
  formats: {
    readonly [ALL]: Map<string, LocalObject>,
    [formato: string]: Map<string, LocalObject>,
  };

  constructor(options?: LocalAddressOptions) {
    const locals = flatten(options?.loads);
    this.formats = locals.reduce(
      (acumulator, local) => {
        acumulator[local.Formato] = acumulator[local.Formato] ?? new Map();

        acumulator[ALL].set(local.storeId, local);
        acumulator[local.Formato].set(local.storeId, local);

        return acumulator;
      },
      { [ALL]: new Map() } as LocalAddress['formats'],
    );
    this.locals = this.formats[ALL];
  }

  getStore(storeId: LocalObject['storeId']) {
    return this.locals.get(storeId.toString());
  }

  stringifyAddressLocal(storeId: LocalObject['storeId']) {
    const local = this.locals.get(storeId.toString());

    if (local) {
      return [local.address, local.comuna, local.region].filter(Boolean).join(', ');
    }
  }

  getStoreIds() {
    return this.locals.keys();
  }
}

export default new LocalAddress({
  loads: [
    require('./resources/sucursalesALVI.json'),
    require('./resources/sucursalesM10.json'),
    require('./resources/sucursalesOKM.json'),
    require('./resources/sucursalesUNIMARC.json'),
  ],
});

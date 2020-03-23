import { readFileSync } from 'fs';
import csvParse from 'csv-parse/lib/sync';
import ow from 'ow';
import { relative } from 'path';

interface LocalAddressOptions {
  loads?: string[];
}

interface LocalObject {
  storeId: string;
  address: string;
  comuna: string;
  region: string;
}

class LocalAddress {
  locals = new Map<LocalObject['storeId'], LocalObject>();

  constructor(options?: LocalAddressOptions) {
    if (options && options.loads) {
      options.loads.forEach(load => this.loadFromFile(load));
    }
  }

  loadFromFile(filePath: string) {
    const bf = readFileSync(filePath, 'utf8');
    const locals = csvParse(bf, {
      columns: true,
    }) as LocalObject[];

    const objectValidate = ow.object.partialShape({
      storeId: ow.string.nonEmpty,
      address: ow.string.nonEmpty,
      comuna: ow.string,
      region: ow.string,
    });

    ow(locals, `${relative(process.cwd(), filePath)}`, ow.array.ofType(objectValidate));

    locals.forEach((local) => {
      this.locals.set(local.storeId.toString(), local);
    });
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
    `${__dirname}/resources/sucursalesALVI.csv`,
    `${__dirname}/resources/sucursalesM10.csv`,
    `${__dirname}/resources/sucursalesOKM.csv`,
    `${__dirname}/resources/sucursalesUNIMARC.csv`,
  ],
});

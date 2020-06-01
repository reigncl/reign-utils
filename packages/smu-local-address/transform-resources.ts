import { readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import csvParse from 'csv-parse/lib/sync';
import ow from 'ow';

interface LocalObject {
  storeId: string;
  format: string;
  name: string;
  address: string;
  location: string;
  region: string;
}

readdirSync(`${__dirname}/resources`)
  .map(filePath => `${__dirname}/resources/${filePath}`)
  .map(filePath => {
    const locals: LocalObject[] = csvParse(readFileSync(filePath, 'utf8'), {
      columns: true,
      delimiter: ','
    });

    const localGrouped = locals.reduce((acum, local) => {
      acum[local.format] = acum[local.format] ?? [];

      acum[local.format].push(local);

      return acum;
    }, {} as { [k: string]: LocalObject[] });

    for (const [format, locals] of Object.entries(localGrouped)) {
      const namefile = `${path.basename(filePath, path.extname(filePath))}_${format.replace(/[^\w]+/g, '_')}`;

      const filePathOut = path.format({
        dir: path.dirname(filePath),
        name: namefile,
        ext: '.json',
      });

      writeFileSync(filePathOut, JSON.stringify(locals, null, 2));
    }
  });

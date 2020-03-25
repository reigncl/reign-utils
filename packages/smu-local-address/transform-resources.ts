import { readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import csvParse from 'csv-parse/lib/sync';
import ow from 'ow';

readdirSync(`${__dirname}/resources`)
  .map(filePath => `${__dirname}/resources/${filePath}`)
  .map(filePath => {
    const locals = csvParse(readFileSync(filePath, 'utf8'), {
      columns: true,
    });

    const objectPredicate = ow.object.partialShape({
      storeId: ow.string.nonEmpty,
      address: ow.string.nonEmpty,
      comuna: ow.string,
      region: ow.string,
      Formato: ow.string,
    });

    ow(locals, `${filePath}`, ow.array.ofType(objectPredicate));

    const filePathOut = path.format({
      dir: path.dirname(filePath),
      name: path.basename(filePath, path.extname(filePath)),
      ext: '.json',
    });

    writeFileSync(filePathOut, JSON.stringify(locals, null, 2));
  });

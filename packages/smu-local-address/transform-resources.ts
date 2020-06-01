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

    const filePathOut = path.format({
      dir: path.dirname(filePath),
      name: path.basename(filePath, path.extname(filePath)),
      ext: '.json',
    });

    writeFileSync(filePathOut, JSON.stringify(locals, null, 2));
  });

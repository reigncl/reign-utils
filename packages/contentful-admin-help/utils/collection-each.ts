import { Environment } from "contentful-management/typings/environment";
import { ContentType } from 'contentful-management/typings/contentType'
import { Entry } from 'contentful-management/typings/entry'
import { Locale } from 'contentful-management/typings/locale'
import { UIExtension } from 'contentful-management/typings/uiExtension'
import { Asset } from 'contentful-management/typings/asset'

type typesMap = {
  contentTypes: ContentType;
  assets: Asset;
  entries: Entry;
  locales: Locale;
  uiExtensions: UIExtension;
}

const collectionEach = <L extends keyof typesMap>(environment: Environment, method: L) => {
  const fn = ((m = method) => {
    switch (m) {
      case 'contentTypes': return environment.getContentTypes.bind(environment);
      case 'assets': return environment.getAssets.bind(environment);
      case 'entries': return environment.getEntries.bind(environment);
      case 'locales': return environment.getLocales.bind(environment);
      case 'uiExtensions': return environment.getUiExtensions.bind(environment);
      default: throw new Error(`method ${m} no implement`);
    }
  })();

  type E = typesMap[L];

  const limit = 100;

  let currentIndex = 0;
  let items: E[] = [];
  let total: number;
  let nextPaginate = async () => {
    const collection = await fn({ limit, skip: currentIndex });
    total = collection.total;
    items.push(...(collection.items as E[]));
    return collection;
  }

  let firstPagination = nextPaginate();

  return {
    next: async () => {
      await firstPagination;

      if (currentIndex >= total) {
        return undefined;
      }

      if (items?.[currentIndex] === undefined) {
        await nextPaginate();
      }

      const item = items[currentIndex];
      currentIndex += 1;

      return item;
    },
    async toArray() {
      let coll: E[] = [];
      let e;
      while (e = await this.next()) {
        coll.push(e);
      }
      return coll;
    }
  };
}

export default collectionEach;

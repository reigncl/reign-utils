import { ClientAPI } from 'contentful-management';
import collectionEach from '../utils/collection-each';

type ClientOption = {
  client: ClientAPI,
  spaceId: string,
}

export default async (clientOrigin: ClientOption, clientDestiny: ClientOption) => {
  const spaceOrigin = await (await clientOrigin.client.getSpace(clientOrigin.spaceId)).getEnvironment('master');
  const spaceDestiny = await (await clientDestiny.client.getSpace(clientDestiny.spaceId)).getEnvironment('master');

  const contentTypesOrigin = collectionEach(spaceOrigin, 'contentTypes');
  const contentTypesDestiny = await collectionEach(spaceDestiny, 'contentTypes').toArray();

  let contentTypeOrigin;
  while (contentTypeOrigin = await contentTypesOrigin.next()) {
    const contentTypeId = contentTypeOrigin.sys.id;

    let contentTypeDestiny = contentTypesDestiny.find(c => c.sys.id === contentTypeId) ?? await spaceDestiny.createContentTypeWithId(contentTypeId, {
      name: contentTypeOrigin.name,
      description: contentTypeOrigin.description,
      displayField: contentTypeOrigin.displayField,
      fields: contentTypeOrigin.fields,
    });

    if (contentTypeDestiny.isPublished() !== contentTypeOrigin.isPublished()) {
      if (contentTypeOrigin.isPublished()) {
        contentTypeDestiny = await contentTypeDestiny.publish();
      } else {
        contentTypeDestiny = await contentTypeDestiny.unpublish();
      }
    }

    console.log(`Done ${contentTypeOrigin.name} ${contentTypeDestiny.isPublished()}`);
  }
}


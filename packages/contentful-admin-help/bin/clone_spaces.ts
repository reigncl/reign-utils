import { createClient } from 'contentful-management';
import clone_spaces from '../src/clone_spaces';

const client = createClient({
  accessToken: 'CFPAT-4rYS1Oi7pm7o8qxIk_PvgULENaM-s4viTlWc8Jmo6YU',
});

clone_spaces(
  { client: client, spaceId: 'zthh5r2l9hfh' },
  { client: client, spaceId: 'cq7qppzbukhn' },
);

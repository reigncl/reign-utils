import bent from 'bent';
import throttle from 'lodash.throttle';
import ms from 'ms';

type Hit = {
  _index: string;
  _type?: string;
  time?: Date;
  action?: string;
  error?: string;
  [params: string]: any;
};

const sysEnv = Object.entries(process.env)
  .filter(([envname]) => {
    if (envname.startsWith('SYS_')) return true;
    if (envname.startsWith('TAG_')) return true;
    if (envname.startsWith('NODE')) return true;
    if (envname.startsWith('DYNO')) return true;
    if (envname.startsWith('HEROKU')) return true;
    if (envname.startsWith('PORT')) return true;
    return false;
  })
  .reduce(
    (o, [envname, envvalue]) => ({ ...o, [envname]: envvalue }),
    {} as { [k: string]: undefined | string },
  );

type ConfigPushHit = {
  baseUrl: string;
  enabled?: boolean;
  environment?: string;
  target?: string;
  inervalPush?: string;
}

export class PushHit {
  private upload: any;
  private hitsCollection: string[] = [];

  constructor(private config: ConfigPushHit) {
    const put = bent(this.config.baseUrl, 'buffer', 'POST');

    this.upload = throttle<any>(
      async () => {
        const dataUpload = Buffer.from([...this.hitsCollection, ''].join('\n'));
        this.hitsCollection = [];

        const res = await put(
          '/_bulk?pretty',
          Buffer.from(dataUpload),
          {
            'Content-Type': 'application/x-ndjson',
          },
        );

        return res;
      },
      ms(this.config.inervalPush ?? '5s'),
    );
  }

  push(hit: Hit) {
    const { _index, _type, ...dataHit } = hit;

    const nexIndex = _index;

    if (this.config.enabled === false) {
      return Promise.resolve(null);
    }

    const target = this.config.target;
    const environment = this.config.environment ?? process.env.NODE_ENV;

    this.hitsCollection.push(
      JSON.stringify({ index: { _type, _index: nexIndex } }),
      JSON.stringify({
        ...dataHit,
        target,
        environment,
        sys: {
          env: sysEnv,
        },
        time: dataHit.time ?? new Date(),
      }),
    );

    return this.upload().catch((err: Error) => {
      console.error(err.message || err);
      return ({ error: err });
    });
  }
}

export const createPushHit = (config: ConfigPushHit) => {
  const pushHit = new PushHit(config);

  return pushHit;
}

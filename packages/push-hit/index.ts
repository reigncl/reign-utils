import bent from 'bent';
import throttle from 'lodash.throttle';
import ms from 'ms';
import { formatToTimeZone } from 'date-fns-timezone/dist/formatToTimeZone';

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
  /** Default: `true` */
  enabled?: boolean;
  /** Default: `process.env.NODE_ENV` */
  environment?: string;
  target?: string;
  /** Default: `"5s"` */
  inervalPush?: string;
  /** Default: `true` */
  indexDateStrategy?: boolean;
  /** Default: `"America/Santiago"` */
  indexDateTimeZone?: string;
  /** 
   * Default: `"YYYY.MM.DD"`
   * @external https://github.com/prantlf/date-fns-timezone/blob/HEAD/docs/API.md#formattotimezone
   */
  indexDateFormat?: string;
}

export class PushHit {
  private upload: any;
  private hitsCollection: string[] = [];
  private config: ConfigPushHit & Required<Pick<ConfigPushHit, Exclude<keyof ConfigPushHit, 'environment' | 'target'>>>;

  constructor(config: ConfigPushHit) {
    this.config = {
      ...config,
      inervalPush: config.inervalPush ?? '5s',
      enabled: config.enabled ?? true,
      environment: config.environment ?? process.env.NODE_ENV,
      indexDateStrategy: config.indexDateStrategy ?? true,
      indexDateTimeZone: config.indexDateTimeZone ?? 'America/Santiago',
      indexDateFormat: config.indexDateFormat ?? 'YYYY.MM.DD',
    }

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
      ms(this.config.inervalPush),
    );
  }

  push(hit: Hit) {
    const { _index, _type, ...dataHit } = hit;

    const nexIndex = this.config.indexDateStrategy ? `${_index}-${formatToTimeZone(new Date(), this.config.indexDateFormat, { timeZone: this.config.indexDateTimeZone })}` : _index;

    if (this.config.enabled === false) {
      return Promise.resolve(null);
    }

    const target = this.config.target;
    const environment = this.config.environment;

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

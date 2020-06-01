import { LocalAddress } from "./LocalAddress";

export default new LocalAddress({
  loads: [
    require('./resources/CENTER_INFORMATION_UNIMARC.json'),
    require('./resources/CENTER_INFORMATION_OK_MARKET.json'),
    require('./resources/CENTER_INFORMATION_MAYORISTA_10.json'),
    require('./resources/CENTER_INFORMATION_ALVI.json'),
  ],
});

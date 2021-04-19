import { Configuration } from '@midwayjs/decorator';
import { join } from 'path';

@Configuration({
  namespace: 'bull',
  importConfigs: [
    join(__dirname, 'config')
  ]
})
export class AutoConfiguration {

}

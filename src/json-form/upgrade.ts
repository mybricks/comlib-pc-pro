import { deepCopy } from '../utils';
import { BasicColumSchema, GridColumSchema, InputIds } from './constant';
import { Data } from './constant';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
   * v1.0.0 -> v1.0.1 控制操作按钮的显示隐藏
   */
  if (typeof data?.submitter === 'undefined') {
    (data.submitter as boolean) = true;
  }

  /**
   * @description v1.0.2 增加 data.grid 配置项、onValuesChange 输出项
   */
  if (!output.get('onValuesChange')) {
    output.add('onValuesChange', '数据变化', {
      type: 'object',
      properties: {
        changedValues: {
          type: 'object'
        },
        allValues: {
          type: 'object'
        }
      }
    });
  }
  //=========== v1.0.2 end ===============

  /**
   * @description v1.0.3 增加 data.config.layout 配置项; fix schema
   */
  if (!data.config) {
    data.config = {
      layout: data.layoutType === 'QueryFilter' ? 'horizontal' : 'vertical'
    };
  }
  const setColumnsInput = input.get(InputIds.SetColumns);
  if (setColumnsInput.schema?.type !== 'array') {
    const schema = deepCopy(BasicColumSchema);
    if (data.grid) {
      schema.items.properties = {
        ...schema.items.properties,
        ...GridColumSchema
      };
    }
    setColumnsInput.setSchema(schema);
  }

  //=========== v1.0.3 end ===============

  return true;
}

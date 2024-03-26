import { Data } from './constant'

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.2 增加 设置运算符 输入项及其关联输出
    */

  const operatorMapSchema = {
    "type": "object",
    "properties": {
      "string": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "label": {
              "type": "string"
            },
            "value": {
              "type": "string"
            },
            "notNeedValue": {
              "type": "boolean"
            },
            "multiple": {
              "type": "boolean"
            }
          }
        }
      },
      "number": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "label": {
              "type": "string"
            },
            "value": {
              "type": "string"
            },
            "notNeedValue": {
              "type": "boolean"
            },
            "multiple": {
              "type": "boolean"
            }
          }
        }
      },
      "date": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "label": {
              "type": "string"
            },
            "value": {
              "type": "string"
            },
            "notNeedValue": {
              "type": "boolean"
            },
            "useTags": {
              "type": "boolean"
            }
          }
        }
      }
    }
  };
  if (!input.get('setOperatorsMap')) {
    input.add('setOperatorsMap', '设置运算符', operatorMapSchema);
  }
  if (!output.get('setOperatorsMapDone')) {
    output.add('setOperatorsMapDone', '设置运算符完成', operatorMapSchema);
  }
  input.get('setOperatorsMap').setRels(['setOperatorsMapDone'])

  //=========== v1.0.2 end ===============

  /**
   * @description v1.0.3 支持最深层级限制
   */

  if(data?.useDeepestLevel === undefined) {
    data.useDeepestLevel = false;
  }

  if(data?.deepestLevel === undefined) {
    data.deepestLevel = 5;
  }

  //=========== v1.0.3 end ===============

  return true;
}

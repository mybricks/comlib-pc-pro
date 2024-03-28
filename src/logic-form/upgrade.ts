import { Data, InputIds, OutputIds } from './constant'

export default function ({ data, input, output, style }: UpgradeParams<Data>): boolean {
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
  if (!input.get(InputIds.SetOperatorsMap)) {
    input.add(InputIds.SetOperatorsMap, '设置运算符', operatorMapSchema);
  }
  if (!output.get(OutputIds.SetOperatorsMapDone)) {
    output.add(OutputIds.SetOperatorsMapDone, '设置运算符完成', operatorMapSchema);
  }
  input.get(InputIds.SetOperatorsMap).setRels([OutputIds.SetOperatorsMapDone])

  //=========== v1.0.2 end ===============

  /**
   * @description v1.0.3 
   * 支持最深层级限制
   * 增加io: input.addGroup output.addGroupDone io
   * 增加配置项: 是否使用默认空白占位useDefaultEmpty、条件只有一个时是否展示连接符showJoinerWhenOnlyOneCondition、展示条件组序号showConditionOrder
   */

  if (data?.useDeepestLevel === undefined) {
    data.useDeepestLevel = false;
  }

  if (data?.deepestLevel === undefined) {
    data.deepestLevel = 5;
  }

  if (!input.get(InputIds.AddGroup)) {
    input.add(InputIds.AddGroup, '添加一个条件组', { type: 'any' });
  }
  if (!output.get(OutputIds.AddGroupDone)) {
    output.add(OutputIds.AddGroupDone, '添加条件组完成', operatorMapSchema);
  }
  input.get(InputIds.AddGroup).setRels([OutputIds.AddGroupDone])

  if (data.useDefaultEmpty === undefined) {
    data.useDefaultEmpty = true;
  }
  if (data.showJoinerWhenOnlyOneCondition === undefined) {
    data.showJoinerWhenOnlyOneCondition = true;
  }

  if (style.height === undefined) {
    style.height = 'auto';
  }
  //=========== v1.0.3 end ===============

  if (style?.onlyShowOutermostLayerConditionOrder === undefined) {
    style.onlyShowOutermostLayerConditionOrder = false;
  }

  return true;
}

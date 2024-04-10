/** 获取判断字段查询的条件符号 */
import { FieldDBType } from './constant';

export const getFieldConditionAry = (
  dbType: string,
  customOperators
): Array<{ label: string; value: string; notNeedValue?: boolean; useTags?: boolean }> => {
  return customOperators?.[dbType] || customOperators?.[FieldDBType.STRING];
};

export function dfs(cb: Function, childKey: string, nodes?: { [key: string]: any }[]) {
  if (!nodes?.length) {
    return;
  }
  for (const node of nodes) {
    cb(node);
    dfs(cb, childKey, node[childKey]);
  }
}

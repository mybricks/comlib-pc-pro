/** 获取判断字段查询的条件符号 */
import { FieldDBType } from "./constant";

export const getFieldConditionAry = (dbType: string, customOperators)
	: Array<{ label: string; value: string; notNeedValue?: boolean; useTags?: boolean }> => {
	return customOperators?.[dbType] || customOperators?.[FieldDBType.STRING];
};
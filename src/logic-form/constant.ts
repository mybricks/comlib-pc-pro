export enum SQLOperator {
	/** 等于 */
	EQUAL = '=',
	/** 不等于 */
	NOT_EQUAL = '<>',
	/** 匹配 */
	LIKE = 'LIKE',
	/** 不匹配 */
	NOT_LIKE = 'NOT LIKE',
	/** 包含 */
	IN = 'IN',
	/** 不包含 */
	NOT_IN = 'NOT IN',
	/** 大于等于 */
	GE = '>=',
	/** 小于等于 */
	LE = '<=',
	/** 大于 */
	G = '>',
	/** 小于 */
	L = '<',
	IS_NULL = 'IS NULL',
	IS_NOT_NULL = 'IS NOT NULL',
}

export enum SQLWhereJoiner {
	AND = 'AND',
	OR = 'OR',
}

/** 数据库字段类型 */
export enum FieldDBType {
	STRING = 'string',
	NUMBER = 'number',
	DATE = 'date',
}

export const defaultOperators = {
	string: [
		{ label: '等于(=)', value: '=' },
		{ label: '不等于(<>)', value: '<>' },
		{ label: '匹配(LIKE)', value: 'LIKE' },
		{ label: '不匹配(NOT LIKE)', value: 'NOT LIKE' },
		{ label: '包含(IN)', value: 'IN', useTags: true },
		{ label: '不包含(NOT IN)', value: 'NOT IN', useTags: true },
		{ label: '等于 NULL', value: 'IS NULL', notNeedValue: true },
		{ label: '不等于 NULL', value: 'IS NOT NULL', notNeedValue: true },
	],
	number: [
		{ label: '等于(=)', value: '=' },
		{ label: '不等于(<>)', value: '<>' },
		{ label: '大于(>)', value: '>' },
		{ label: '小于(<)', value: '<' },
		{ label: '大于等于(>=)', value: '>=' },
		{ label: '小于等于(<=)', value: '<=' },
		{ label: '包含(IN)', value: 'IN', useTags: true },
		{ label: '不包含(NOT IN)', value: 'NOT IN', useTags: true },
		{ label: '等于 NULL', value: 'IS NULL', notNeedValue: true },
		{ label: '不等于 NULL', value: 'IS NOT NULL', notNeedValue: true },
	],
	date: [
		{ label: '等于(=)', value: '=' },
		{ label: '不等于(<>)', value: '<>' },
		{ label: '大于(>)', value: '>' },
		{ label: '小于(<)', value: '<' },
		{ label: '大于等于(>=)', value: '>=' },
		{ label: '小于等于(<=)', value: '<=' },
		{ label: '等于 NULL', value: 'IS NULL', notNeedValue: true },
		{ label: '不等于 NULL', value: 'IS NOT NULL', notNeedValue: true },
	]
}

export interface Data {
	useDeepestLevel: boolean;
	deepestLevel: number;
}
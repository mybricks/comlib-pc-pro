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

export const conditionsWhenEdit = {
	id: "0",
	fieldId: "0",
	fieldName: "条件组",
	whereJoiner: "AND",
	conditions: [
		{
			id: "0-0",
			operator: "=",
			fieldId: "条件0-0(搭建态占位)",
			fieldName: "条件0-0(搭建态占位)",
			value: '1'
		},
		{
			id: "0-1",
			fieldId: "0-1",
			fieldName: "条件组",
			whereJoiner: "OR",
			conditions: [
				{
					fieldId: "条件0-1-0",
					fieldName: "条件0-1-0",
					id: "0-1-0",
					operator: "IN",
					value: ['1', '2']
				},
				{
					fieldId: "条件0-1-1",
					fieldName: "条件0-1-1",
					operator: "IS NULL",
					id: "0-1-1"
				}
			]
		},
		{
			id: "0-2",
			fieldId: "0-2",
			fieldName: "条件组",
			whereJoiner: "OR",
			conditions: [
				{
					fieldId: "条件0-2-0",
					fieldName: "条件0-2-0",
					id: "0-2-0",
					operator: "NOT LIKE",
					value: '%'
				}
			]
		}
	]
};

export const InputIds = {
	Submit: 'submit',
	SetLogicConditions: 'setLogicConditions',
	SetFields: 'setFields',
	SetOperatorsMap: 'setOperatorsMap',
	AddGroup: 'addGroup'
}

export const OutputIds = {
	OnFinishForRels: 'onFinishForRels',
	AddGroupDone: 'addGroupDone',
	SetOperatorsMapDone: 'setOperatorsMapDone',
}
export interface Data {
	useDeepestLevel: boolean;
	deepestLevel: number;
	useDefaultEmpty: boolean;
	showJoinerWhenOnlyOneCondition: boolean;
	showConditionOrder: boolean;
	onlyShowOutermostLayerConditionOrder?: boolean; // 是否只展示最外层条件组序号
}
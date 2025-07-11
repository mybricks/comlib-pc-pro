import React, { useRef, useLayoutEffect, useCallback, useState, useMemo } from 'react';
import {
  DatePicker,
  DatePickerProps,
  Dropdown,
  Form,
  FormItemProps,
  Input,
  InputProps,
  Menu,
  Select,
  SelectProps
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  Data,
  FieldDBType,
  InputIds,
  OutputIds,
  SQLWhereJoiner,
  defaultOperators,
  conditionsWhenEdit
} from './constant';
import { getFieldConditionAry, dfs, isEmpty } from './util';
import { uuid } from '../utils';

import styles from './styles.less';

export interface Condition {
  id: string;
  /** 字段 ID */
  fieldId?: string;
  /** 字段名 */
  fieldName?: string;
  /** 操作符 */
  operator?: string;
  /** 条件语句值 */
  value?: string;
  /** 所在条件组的索引 */
  parentIndex?: number;
  conditions?: Condition[];
  whereJoiner?: SQLWhereJoiner;
  validateStatus?: 'success' | 'warning' | 'error' | 'validating';
  errorMsg?: string;
  notNeedValue?: boolean;
}

interface Field {
  name: string;
  id: string;
  type: string;
  /**@description v1.0.1 输入框属性 */
  fieldProps?: InputProps | SelectProps | DatePickerProps;
  /**@description v1.0.1 表单项属性 TODO: 暂未生效 */
  formProps?: FormItemProps;
}

export default function (props: RuntimeParams<Data>) {
  const { env, inputs, data } = props;
  const [form] = Form.useForm();
  const getBaseCondition = useCallback(() => {
    return {
      id: uuid(),
      fieldId: '0',
      fieldName: '条件组',
      whereJoiner: SQLWhereJoiner.AND,
      conditions: []
    };
  }, []);

  const marginEm = useMemo(() => {
    return data.showConditionOrder ? 60 : 30;
  }, [data.showConditionOrder]);

  const [fieldList, setFieldList] = useState<Field[]>([]);
  const [operatorsMap, setOperatorsMap] = useState(defaultOperators);
  const [logicConditions, setLogicConditions] = useState<Condition>(getBaseCondition());
  const logicConditionsRef = useRef<Condition>({ ...getBaseCondition() });
  const [disabled, setDisabled] = useState<boolean>(false);
  useLayoutEffect(() => {
    inputs[InputIds.Submit]((val, outputRels) => {
      let success: boolean = true;
      dfs(
        (node: Condition) => {
          if (!node.conditions && isEmpty(node.value) && !node?.notNeedValue) {
            node.validateStatus = 'error';
            node.errorMsg = '内容不能为空';
            success = false;
          }
        },
        'conditions',
        logicConditionsRef.current.conditions
      );
      if (success) {
        outputRels['onFinishForRels'](logicConditionsRef.current);
      } else {
        onTriggerChange();
      }
    });

    inputs[InputIds.SetLogicConditions]((val) => {
      setLogicConditions(val);
      logicConditionsRef.current = val;
    });

    inputs[InputIds.SetFields]((val) => {
      setFieldList(val);
    });

    inputs[InputIds.SetOperatorsMap]?.((val, outputRels) => {
      setOperatorsMap(val);
      outputRels['setOperatorsMapDone'](val);
    });

    inputs[InputIds.AddGroup]?.((val, outputRels) => {
      if (Array.isArray(logicConditionsRef.current?.conditions)) {
        const length = logicConditionsRef.current.conditions.length;
        logicConditionsRef.current.conditions.push({
          ...getBaseCondition(),
          fieldId: logicConditionsRef.current.fieldId + '-' + length,
          conditions: [{ ...getEmptyCondition() }]
        });
      } else {
        logicConditionsRef.current = {
          ...getBaseCondition(),
          fieldId: '0',
          conditions: [
            {
              ...getBaseCondition(),
              fieldId: '0-0',
              conditions: [{ ...getEmptyCondition() }]
            }
          ]
        };
      }
      onTriggerChange();
      outputRels[OutputIds.AddGroupDone](val);
    });

    inputs[InputIds.SetDisabled]?.((val, outputRels) => {
      setDisabled(true);
      outputRels[OutputIds.SetDisabledDone](true);
    });

    inputs[InputIds.SetEnabled]?.((val, outputRels) => {
      setDisabled(false);
      outputRels[OutputIds.SetEnabledDone](false);
    });
  }, []);

  const getEmptyCondition = useCallback(() => {
    return {
      id: uuid()
    };
  }, []);

  const onTriggerChange = useCallback(() => {
    setLogicConditions({ ...logicConditionsRef.current });
  }, []);

  const validateEmptyInput = useCallback((value, condition) => {
    if (!value) {
      condition.validateStatus = 'error';
      condition.errorMsg = '内容不能为空';
    } else {
      delete condition.validateStatus;
      delete condition.errorMsg;
    }
  }, []);

  const onEmptyAdd = useCallback(() => {
    if (env.edit) {
      return;
    }
    if (logicConditionsRef.current) {
      logicConditionsRef.current.conditions = [{ ...getEmptyCondition() }];
    } else {
      logicConditionsRef.current = {
        ...getBaseCondition(),
        fieldId: '0',
        conditions: [{ ...getEmptyCondition() }]
      };
    }

    onTriggerChange();
  }, []);

  const removeCondition = useCallback((params) => {
    const { index, parentConditionChain } = params;
    const parentCondition = parentConditionChain[parentConditionChain.length - 1];
    if (parentCondition) {
      parentCondition.conditions = parentCondition.conditions?.filter((_, idx) => idx !== index);

      if (!parentCondition.conditions.length) {
        const secondParent = parentConditionChain[parentConditionChain.length - 2];

        if (secondParent) {
          secondParent.conditions = secondParent.conditions?.filter(
            (con) => con.fieldId !== parentCondition.fieldId
          );
        }
      }
    }

    onTriggerChange();
  }, []);

  const addCondition = useCallback((params) => {
    const { parentConditionChain, group } = params;
    const parentCondition = parentConditionChain[parentConditionChain.length - 1];

    if (parentCondition) {
      const parentConditionLength = parentCondition.length;
      parentCondition.conditions.push(
        group
          ? {
              ...getBaseCondition(),
              fieldId: parentCondition.fieldId + '-' + parentConditionLength,
              conditions: [{ ...getEmptyCondition() }]
            }
          : { ...getEmptyCondition() }
      );
    }

    onTriggerChange();
  }, []);

  const getDate = useCallback((val: any) => {
    if (val === undefined) return void 0;
    if (moment(val).isValid()) {
      return moment(val);
    }
    return void 0;
  }, []);

  const getFormItem = useCallback(
    (operator, condition) => {
      const field = fieldList.find((f) => f.id === condition.fieldId);
      // 提交数据中增加类型字段
      condition.type = field?.type;
      const fieldProps = field?.fieldProps || ({} as any);
      if (operator?.notNeedValue) {
        return <span style={{ width: '130px', height: '24px' }} />;
      } else if (operator?.useTags) {
        return (
          <Select
            allowClear
            placeholder="请输入内容"
            mode="tags"
            {...fieldProps}
            value={condition.value}
            onChange={(value) => {
              validateEmptyInput(value, condition);
              condition.value = value;

              onTriggerChange();
            }}
          />
        );
      } else {
        let node = (
          <Input
            allowClear
            placeholder="请输入内容"
            className={styles.valueInput}
            {...fieldProps}
            value={condition.value}
            onChange={(e) => {
              validateEmptyInput(e.target.value, condition);
              condition.value = e.target.value;
              onTriggerChange();
            }}
          />
        );

        if (field?.type === FieldDBType.DATE) {
          const { format } = fieldProps;
          node = (
            <DatePicker
              allowClear
              showTime
              placeholder="请选择时间"
              {...fieldProps}
              value={getDate(condition.value)}
              onChange={(value) => {
                validateEmptyInput(value?.valueOf?.() || value, condition);
                condition.value = value?.valueOf?.() || value;
                if (format) {
                  switch (typeof format) {
                    case 'string':
                      condition.value = moment(condition.value).format(fieldProps.format);
                      break;
                    case 'function':
                      condition.value = format(condition.value);
                      break;
                  }
                }
                onTriggerChange();
              }}
            />
          );
        }

        return node;
      }
    },
    [fieldList]
  );

  const Order = useCallback(({ index }) => {
    return <div className={styles.order}>{index + 1}</div>;
  }, []);

  const Divider = useCallback(
    ({ parentConditionChain, condition, index, showOrder = true }) => {
      let orderJSX: any = null;
      if (data.showConditionOrder && parentConditionChain.length) {
        orderJSX = (
          <div className={styles.orderBox}>
            <Order index={index} />
          </div>
        );
      }

      let joinerJSX: any = null;
      if (condition.conditions?.length > 1 || data.showJoinerWhenOnlyOneCondition) {
        joinerJSX = (
          <div
            className={styles.whereJoiner}
            style={{ pointerEvents: disabled ? 'none' : 'auto' }}
            onClick={(e: any) => {
              condition.whereJoiner =
                condition.whereJoiner === SQLWhereJoiner.AND
                  ? SQLWhereJoiner.OR
                  : SQLWhereJoiner.AND;
              onTriggerChange();
            }}
          >
            {condition.whereJoiner === SQLWhereJoiner.AND ? '且' : '或'}
          </div>
        );
      }

      return (
        <div
          className={`${styles.dividerLine} ${joinerJSX ? '' : styles.hidden}`}
          style={{ marginLeft: marginEm * parentConditionChain.length + 'px' }}
        >
          {showOrder && orderJSX}
          {joinerJSX}
        </div>
      );
    },
    [disabled]
  );

  const renderConditions = useCallback(
    ({
      conditions,
      parentConditionChain = [],
      parentNames = [],
      parentIndex = 0,
      parentLayer = 0
    }: {
      conditions: Condition[];
      parentConditionChain?: Condition[];
      parentNames?: string[];
      parentIndex?: number;
      parentLayer?: number /** 第几层 */;
    }) => {
      return (
        conditions
          .map((condition, index) => {
            condition.parentIndex = parentIndex;
            const showOrder =
              data.showConditionOrder &&
              (!data.onlyShowOutermostLayerConditionOrder || parentLayer === 1);
            const originField = fieldList.find((f) => f.id === condition.fieldId);
            const operators = getFieldConditionAry(
              originField?.type || FieldDBType.STRING,
              operatorsMap
            );
            const curOperator = operators.find((op) => op.value === condition.operator);
            const formProps = originField?.formProps || ({} as any);
            let orderJSX: any = null;
            if (showOrder) {
              orderJSX = (
                <div className={styles.orderBox}>
                  <Order index={index} />
                </div>
              );
            }
            return condition.conditions ? (
              <div key={condition.fieldId} className={styles.conditionGroup}>
                {renderConditions({
                  conditions: condition.conditions,
                  parentConditionChain: [...parentConditionChain, condition],
                  parentNames: parentNames.length
                    ? [...parentNames, String(index), 'conditions']
                    : ['conditions'],
                  parentIndex: index,
                  parentLayer: parentLayer + 1
                })}
                <Divider
                  parentConditionChain={parentConditionChain}
                  condition={condition}
                  showOrder={showOrder}
                  index={index}
                />
              </div>
            ) : (
              <div
                key={index}
                className={styles.condition}
                style={{ marginLeft: marginEm * parentConditionChain.length + 'px' }}
              >
                {orderJSX}
                <Form.Item
                  className={styles.fieldFormItem}
                  initialValue={condition.fieldId}
                  name={[...parentNames, index, 'fieldId']}
                  required
                >
                  <Select
                    allowClear
                    value={condition.fieldId}
                    placeholder="请选择字段"
                    onChange={(value) => {
                      const curField = fieldList.find((f) => f.id === value);

                      if (curField) {
                        condition.fieldId = value;
                        condition.fieldName = curField.name;
                      }
                      onTriggerChange();
                    }}
                  >
                    {fieldList.map((field) => {
                      return (
                        <Select.Option key={field.id} value={field.id}>
                          {field.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  className={styles.operatorFormItem}
                  initialValue={condition.operator}
                  name={[...parentNames, index, 'operator']}
                >
                  <Select
                    value={condition.operator}
                    className={styles.operatorSelect}
                    onChange={(value) => {
                      condition.operator = value;
                      const curOperator = operators.find((op) => op.value === value);

                      if (curOperator?.notNeedValue) {
                        condition.value = undefined;
                        condition.notNeedValue = true;
                      }

                      onTriggerChange();
                    }}
                  >
                    {operators.map((operator, idx) => {
                      return (
                        <Select.Option key={idx} value={operator.value}>
                          {operator.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  className={styles.valueFormItem}
                  initialValue={
                    originField?.type === FieldDBType.DATE
                      ? moment(condition.value)
                      : condition.value
                  }
                  {...formProps}
                  validateStatus={condition.validateStatus}
                  help={condition.errorMsg}
                >
                  {getFormItem(curOperator, condition)}
                </Form.Item>
                {!disabled ? (
                  <Form.Item className={styles.operatorBox}>
                    {index === 0 ? (
                      !data.useDeepestLevel || parentConditionChain?.length < data.deepestLevel ? (
                        <Dropdown
                          placement="bottomRight"
                          overlay={
                            <Menu>
                              <Menu.Item
                                key="condition"
                                onClick={() => addCondition({ parentConditionChain })}
                              >
                                条件
                              </Menu.Item>
                              <Menu.Item
                                key="group"
                                onClick={() => addCondition({ group: true, parentConditionChain })}
                              >
                                条件组
                              </Menu.Item>
                            </Menu>
                          }
                        >
                          <span className={styles.icon}>
                            <PlusOutlined />
                          </span>
                        </Dropdown>
                      ) : (
                        <span
                          className={`${styles.icon}`}
                          onClick={() => addCondition({ parentConditionChain })}
                        >
                          <PlusOutlined />
                        </span>
                      )
                    ) : null}
                    <span
                      className={styles.icon}
                      onClick={() => removeCondition({ index, parentConditionChain })}
                    >
                      <DeleteOutlined />
                    </span>
                  </Form.Item>
                ) : null}
              </div>
            );
          })
          .filter(Boolean) || []
      );
    },
    [fieldList, operatorsMap, disabled]
  );
  if (env.edit) {
    return (
      <Form form={form} disabled={disabled}>
        {renderConditions({ conditions: [conditionsWhenEdit as Condition] })}
      </Form>
    );
  }
  return (
    <>
      {logicConditions?.conditions?.length ? (
        <Form form={form} disabled={disabled}>
          {renderConditions({
            conditions: logicConditionsRef.current ? [logicConditionsRef.current] : []
          })}
        </Form>
      ) : data.useDefaultEmpty ? (
        <div className={styles.empty} onClick={onEmptyAdd}>
          暂无条件，点击
          <span className={styles.emptyAddIcon}>
            <PlusOutlined />
          </span>
          新增条件
        </div>
      ) : null}
    </>
  );
}

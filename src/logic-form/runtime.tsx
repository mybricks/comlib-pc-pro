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
import { Data, FieldDBType, SQLOperator, SQLWhereJoiner, defaultOperators } from './constant';
import { getFieldConditionAry } from './util';
import { deepCopy, uuid } from '../utils';

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
  conditions?: Condition[];
  /** 条件组的运算符 */
  whereJoiner?: SQLWhereJoiner;
  /** 所在条件组的运算符 */
  parentWhereJoiner?: SQLWhereJoiner;
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

const getEmptyCondition = () => {
  return {
    id: uuid()
  };
};

export default function (props: RuntimeParams<Data>) {
  const { env, inputs, data } = props;
  const [form] = Form.useForm();
  const [fieldList, setFieldList] = useState<Field[]>([]);
  const [operatorsMap, setOperatorsMap] = useState(defaultOperators);
  const BaseCondition = useMemo(() => {
    return {
      id: uuid(),
      fieldId: uuid(),
      fieldName: '条件组',
      whereJoiner: SQLWhereJoiner.AND,
      conditions: [getEmptyCondition()]
    };
  }, []);
  const [logicConditions, setLogicConditions] = useState<Condition[]>([BaseCondition]);
  const logicConditionsRef = useRef<Condition[]>([{ ...BaseCondition }]);
  const rootCondition = useMemo(() => {
    return {
      id: 'root',
      fieldId: 'root',
      fieldName: '条件组',
      whereJoiner: SQLWhereJoiner.AND
    };
  }, []);

  useLayoutEffect(() => {
    inputs['submit']((val, outputRels) => {
      form.validateFields().then((v) => {
        logicConditionsRef.current.forEach((group) => {
          group.parentWhereJoiner = rootCondition.whereJoiner;
        });
        outputRels['onFinishForRels'](logicConditionsRef.current);
      });
    });

    inputs['setLogicConditions']((val) => {
      setLogicConditions(val);
      logicConditionsRef.current = val;
    });

    inputs['setFields']((val) => {
      setFieldList(val);
    });

    inputs['setOperatorsMap']?.((val, outputRels) => {
      setOperatorsMap(val);
      outputRels['setOperatorsMapDone'](val);
    });

    inputs['addGroup']?.((val, outputRels) => {
      const newLogicConditions = [...logicConditionsRef.current, deepCopy(BaseCondition)];
      setLogicConditions(newLogicConditions);
      logicConditionsRef.current = newLogicConditions;
      outputRels['addGroupDone'](val);
    });
  }, []);

  const onTriggerChange = useCallback(() => {
    setLogicConditions([...logicConditionsRef.current]);
  }, []);

  const onEmptyAdd = useCallback(() => {
    if (env.edit) {
      return;
    }
    if (logicConditionsRef.current?.[0]) {
      logicConditionsRef.current[0] = {
        ...logicConditionsRef.current[0],
        conditions: [{ ...getEmptyCondition() }]
      };
    } else {
      logicConditionsRef.current = [
        {
          ...BaseCondition,
          conditions: [{ ...getEmptyCondition() }]
        }
      ];
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
      parentCondition.conditions.push(
        group
          ? {
              ...BaseCondition,
              fieldId: uuid(),
              conditions: [{ ...getEmptyCondition() }],
              parentWhereJoiner: parentCondition.whereJoiner
            }
          : { ...getEmptyCondition(), parentWhereJoiner: parentCondition.whereJoiner }
      );
    }

    onTriggerChange();
  }, []);

  const getFormItem = useCallback(
    (operator, condition) => {
      const field = fieldList.find((f) => f.id === condition.fieldId);
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
              condition.value = e.target.value;
              onTriggerChange();
            }}
          />
        );

        if (field?.type === FieldDBType.DATE) {
          node = (
            <DatePicker
              allowClear
              showTime
              placeholder="请选择时间"
              {...fieldProps}
              value={moment(condition.value)}
              onChange={(value) => {
                condition.value = value?.valueOf?.() || value;

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

  const Divider = useCallback(({ parentConditionChain, condition }) => {
    // TODO: 配置项 只有一个条件时，不显示运算符
    if (condition.conditions?.length < 2) {
      return null;
    }
    return (
      <div
        className={styles.dividerLine}
        style={{ marginLeft: 30 * parentConditionChain.length + 'px' }}
      >
        <div
          className={styles.whereJoiner}
          onClick={() => {
            condition.whereJoiner =
              condition.whereJoiner === SQLWhereJoiner.AND ? SQLWhereJoiner.OR : SQLWhereJoiner.AND;
            onTriggerChange();
          }}
        >
          {condition.whereJoiner === SQLWhereJoiner.AND ? '且' : '或'}
        </div>
      </div>
    );
  }, []);

  const renderConditions = useCallback(
    (conditions: Condition[], parentConditionChain: Condition[], parentNames: string[]) => {
      return (
        conditions
          .map((condition, index) => {
            const originField = fieldList.find((f) => f.id === condition.fieldId);
            const operators = getFieldConditionAry(
              originField?.type || FieldDBType.STRING,
              operatorsMap
            );
            const curOperator = operators.find((op) => op.value === condition.operator);
            const formProps = originField?.formProps || ({} as any);
            return condition.conditions ? (
              <div key={condition.fieldId} className={styles.conditionGroup}>
                {renderConditions(
                  condition.conditions,
                  [...parentConditionChain, condition],
                  parentNames.length
                    ? [...parentNames, String(index), 'conditions']
                    : ['conditions']
                )}
                <Divider parentConditionChain={parentConditionChain} condition={condition} />
              </div>
            ) : (
              <div
                key={index}
                className={styles.condition}
                style={{ marginLeft: 30 * parentConditionChain.length + 'px' }}
              >
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
                >
                  {getFormItem(curOperator, condition)}
                </Form.Item>
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
              </div>
            );
          })
          .filter(Boolean) || []
      );
    },
    [fieldList, operatorsMap]
  );

  return (
    <>
      {logicConditions?.length ? (
        <Form form={form}>
          <div key="root" className={styles.conditionGroup}>
            {renderConditions(
              logicConditionsRef.current ? logicConditionsRef.current : [],
              [rootCondition],
              []
            )}
            <Divider parentConditionChain={[]} condition={rootCondition} />
          </div>
        </Form>
      ) : (
        <div className={styles.empty} onClick={onEmptyAdd}>
          暂无条件，点击
          <span className={styles.emptyAddIcon}>
            <PlusOutlined />
          </span>
          新增条件
        </div>
      )}
    </>
  );
}

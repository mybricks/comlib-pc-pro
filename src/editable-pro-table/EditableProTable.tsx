import React, { Suspense, useRef, useCallback, useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import {
  Spin,
  DatePicker,
  TreeSelect,
  Checkbox,
  Cascader,
  Select,
  Tag,
  Input,
  Switch,
  InputNumber,
  Tooltip,
  ConfigProvider,
  Button,
  Popconfirm,
  Empty
} from 'antd';

import { TableRowSelection } from 'antd/lib/table/interface';
import type { ActionType } from '@ant-design/pro-components';
import debounce from 'lodash/debounce';
import {
  INPUTS,
  OUTPUTS,
  Data,
  DataSourceType,
  defaultData,
  TypeEnum,
  getDefaultColumns,
  ROW_KEY
} from './constants';
import {
  addChildByKey,
  deleteItemByKey,
  formatColumn,
  formatDataSource,
  formatSubmitDataSource,
  replacePageElements,
  swapArr,
  handleOutputFn,
  getValueByOptions,
  runDisableScript,
  isNullValue,
  uuid,
  getTemplateRenderScript
} from './utils';

import { EditableProTable } from '@ant-design/pro-table';
import { Actions, Paginator, CustomizeRenderEmpty } from './components';

import styles from './style.less';
import './antd.variable.without.theme.min.css';
// @ts-ignore
// import css from '@ant-design/pro-table/dist/table.min.css';

const { RangePicker } = DatePicker;

const MyDatePicker = (props) => {
  let value = props.value ? moment(props.value) : null;
  return <DatePicker {...props} value={value} />;
};

export default function (props: RuntimeParams<Data>) {
  const { data, slots, inputs, outputs, env, logger, title } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>();
  const defaultDomsRef = useRef<any>({});
  const editableFormRef = useRef<any>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  // 前端分页后表格数据
  const [pageDataSource, setPageDataSource] = useState<any[]>([]);
  // 表格列配置
  const [colsCfg, setColsCfg] = useState<any>({});

  const rowKey = data.rowKey || ROW_KEY;

  const useFrontPage = useMemo(() => {
    return env.runtime && data.usePagination && data.paginationConfig?.useFrontPage;
  }, [env.runtime, data.usePagination, data.paginationConfig?.useFrontPage]);

  const useBackendPage = useMemo(() => {
    return env.runtime && data?.usePagination && !data.paginationConfig?.useFrontPage;
  }, [env.runtime, data.usePagination, data.paginationConfig?.useFrontPage]);

  useEffect(() => {
    if (env.edit) {
      if (data.columns && data.columns.length <= 0) {
        data.columns = getDefaultColumns();
      }
      setDataSource(defaultData);
    } else {
      if (!data.fixedHeader && data.scroll) {
        data.scroll.y = undefined;
      }
      inputs[INPUTS.EditableRows]((val, relOutputs: any) => {
        setEditableRowKeys(val || []);
        handleOutputFn(relOutputs, outputs, OUTPUTS.EditableRowsDone, val);
      });
      inputs[INPUTS.CancelRow]((val, relOutputs: any) => {
        setEditableRowKeys((keys) => {
          const defaultDoms = defaultDomsRef.current;
          // @ts-ignore
          const newLineRecord = actionRef.current?.newLineRecord;

          keys.forEach((key) => {
            if (newLineRecord?.defaultValue._key === key) {
              // 删除
              defaultDoms[key]?.cancel.props.onDelete(key);
            } else {
              // 取消
              actionRef.current?.cancelEditable(key);
            }
          });

          return [];
        });

        handleOutputFn(relOutputs, outputs, OUTPUTS.CancelRowDone, val);
      });
      inputs[INPUTS.SetColConfig]((val: any, relOutputs: any) => {
        setColsCfg(val);
        handleOutputFn(relOutputs, outputs, OUTPUTS.SetColConfigDone, val);
      });
      inputs[INPUTS.SetColValue]((val: any, relOutputs: any) => {
        const value = val?.value;
        const dataIndex = val?.dataIndex;
        const key = val?.rowKey;

        editableFormRef.current?.setRowData?.(key, { [dataIndex]: value });
        handleOutputFn(relOutputs, outputs, OUTPUTS.SetColValueDone, val);
      });
      inputs[INPUTS.SetDataSource]((val: any, relOutputs: any) => {
        if (useBackendPage && val && typeof val === 'object') {
          const dsKey = Object.keys(val);
          if (Array.isArray(val?.dataSource)) {
            const dataSource = formatDataSource(val?.dataSource, data.columns, rowKey);
            setDataSource(dataSource);
            handleOutputFn(relOutputs, outputs, OUTPUTS.SetDataSourceDone, dataSource);
          } else {
            const arrayItemKey = dsKey.filter((key) => !!Array.isArray(val[key]));
            if (arrayItemKey.length === 1) {
              const dataSource = formatDataSource(val?.[arrayItemKey[0]], data.columns, rowKey);
              setDataSource(dataSource);
              handleOutputFn(relOutputs, outputs, OUTPUTS.SetDataSourceDone, dataSource);
            } else {
              console.error('[可编辑表格]：未传入列表数据', val);
            }
          }
          if (typeof val?.total === 'number') {
            data.paginationConfig.total = val?.total;
          } else {
            const numberItemKey = dsKey.filter((key) => !!(typeof val[key] === 'number'));
            if (numberItemKey.length === 1) {
              data.paginationConfig.total = val?.[numberItemKey[0]];
            }
          }
          if (typeof val?.pageSize === 'number' && val?.pageSize > 0) {
            data.paginationConfig.pageSize = val?.pageSize;
          }
          if (typeof val?.pageNum === 'number') {
            data.paginationConfig.current = val?.pageNum;
          }
        } else {
          if (Array.isArray(val)) {
            const dataSource = formatDataSource(val, data.columns, rowKey);
            setDataSource(dataSource);
            handleOutputFn(relOutputs, outputs, OUTPUTS.SetDataSourceDone, dataSource);
          } else {
            console.error('可编辑表格：输入数据格式非法，输入数据必须是数组');
            logger?.error?.('输入数据格式非法，输入数据必须是数组');
          }
        }
      });

      // 动态修改操作配置
      if (data.useOperationDynamic && inputs[INPUTS.SetOpConfig]) {
        inputs[INPUTS.SetOpConfig]((val, relOutputs) => {
          const dataKey = [
            'useAutoSave',
            'hideAllOperation',
            'hideAddBtn',
            'hideModifyBtn',
            'hideDeleteBtn',
            'hideNewBtn',
            'hideDeleteBtnInEdit',
            'hideSaveBtn',
            'hideCancelBtn',
            'clickChangeToedit'
          ];
          handleOutputFn(relOutputs, outputs, OUTPUTS.SetOpConfigDone, val);
          dataKey.forEach((key) => {
            if (val && typeof val[key] === 'boolean') {
              data[key] = val[key];
            }
          });
        });
      }

      // 动态设置表头
      if (data.dynamicColumns && inputs[INPUTS.DynamicColumns]) {
        inputs[INPUTS.DynamicColumns]((val) => {
          if (Array.isArray(val)) {
            const optionColumn = data.columns.find((col) => col.valueType === TypeEnum.Option);
            data.columns = [...val, optionColumn];
          } else {
            logger.warn(`${title}:【设置表头】 输入不是数组`);
          }
        });
      }

      // 监听插槽输出数据
      if (slots) {
        Object.keys(slots).forEach((slot) => {
          const slotOutput = slots[slot]?.outputs[OUTPUTS.EditTableData];
          if (slotOutput) {
            slotOutput((value: any) => {
              if (value !== undefined) {
                data.columns.map((column) => {
                  column?.[value?._key]?.(value?.[column?.dataIndex as any]);
                });
              }
            });
          }
        });
      }
    }
  }, []);

  // 动态设置勾选项
  useEffect(() => {
    if (data.useSetSelectedRowKeys && inputs[INPUTS.SetRowSelect]) {
      const handleSetRowSelect = (val: any) => {
        const selectedKeys = Array.isArray(val) ? val : [val];
        const newSelectedRowKeys = selectedKeys
          .map((selected) => {
            const key =
              typeof selected === 'object' ? selected[data.selectionRowKey || rowKey] : selected;
            return data.selectionRowKey
              ? dataSource.find((item) => item[data.selectionRowKey!] === key)?.[rowKey]
              : key;
          })
          .filter(Boolean); // 过滤掉未找到的key
        setSelectedRowKeys(newSelectedRowKeys);
      };
      inputs[INPUTS.SetRowSelect](handleSetRowSelect);
    }
  }, [dataSource, data.useSetSelectedRowKeys]);

  useEffect(() => {
    if (env.runtime && data.useRowSelection && inputs[INPUTS.GetRowSelect]) {
      inputs[INPUTS.GetRowSelect]((val, relOutputs) => {
        relOutputs[OUTPUTS.GetRowSelect] &&
          relOutputs[OUTPUTS.GetRowSelect]({
            selectedRowKeys: data.selectionRowKey
              ? selectedRowKeys.map(
                  (key) => dataSource.find((item) => item[rowKey] === key)?.[data.selectionRowKey!]
                )
              : selectedRowKeys,
            selectedRows: formatSubmitDataSource(
              dataSource.filter((item) => {
                return selectedRowKeys.includes(item[rowKey]);
              }),
              data.columns
            )
          });
      });
    }
  }, [data.useRowSelection, data.selectionRowKey, selectedRowKeys, dataSource]);

  const debouncedChangeEventOutput = useCallback(
    debounce((val) => {
      outputs[OUTPUTS.ChangeEvent](val);
    }, 200),
    []
  );
  useEffect(() => {
    if (env.runtime) {
      inputs[INPUTS.Submit]((val, relOutputs) => {
        relOutputs[OUTPUTS.Submit](formatSubmitDataSource(dataSource, data.columns));
      });
      inputs[INPUTS.AddRow] &&
        inputs[INPUTS.AddRow]((val: any, relOutputs) => {
          const intiValue = Object.prototype.toString.call(val) === '[object Object]' ? val : {};
          actionRef.current?.addEditRecord?.(
            {
              [rowKey]: uuid(),
              _add: true,
              ...intiValue
            },
            {
              newRecordType: 'dataSource'
            }
          );
          handleOutputFn(relOutputs, outputs, OUTPUTS.AddRowDone, val);
        });
      data.useDelDataSource &&
        inputs[INPUTS.DelRow] &&
        inputs[INPUTS.DelRow]((val) => {
          val = Array.isArray(val) ? val : [val];
          const delKeys: any[] = val.map((item) => item?.[rowKey]).filter((item) => item);
          const newDataSource = formatDataSource(
            dataSource.filter((item) => !delKeys.includes(item?.[rowKey])),
            data.columns,
            rowKey
          );
          setDataSource(newDataSource);
        });

      if (data.useMoveDataSource) {
        inputs[INPUTS.MoveDown] &&
          inputs[INPUTS.MoveDown]((val) => {
            const currKey: string = val?.[rowKey];
            const idx = dataSource.findIndex((item) => currKey === item?.[rowKey]);
            if (idx !== -1 && idx < dataSource.length - 1) {
              const newDataSource = formatDataSource(
                swapArr([...dataSource], idx, idx + 1),
                data.columns,
                rowKey
              );
              setDataSource(newDataSource);
            }
          });
        inputs[INPUTS.MoveUp] &&
          inputs[INPUTS.MoveUp]((val) => {
            const currKey: string = val?.[rowKey];
            const idx = dataSource.findIndex((item) => currKey === item?.[rowKey]);
            if (idx !== -1 && idx > 0) {
              const newDataSource = formatDataSource(
                swapArr([...dataSource], idx, idx - 1),
                data.columns,
                rowKey
              );
              setDataSource(newDataSource);
            }
          });
      }

      if (data.useChangeEvent && outputs[OUTPUTS.ChangeEvent]) {
        debouncedChangeEventOutput(formatDataSource(dataSource, data.columns, rowKey));
      }
    }
  }, [dataSource]);

  useEffect(() => {
    const target = wrapRef.current?.querySelector?.('div.ant-table-body') as HTMLDivElement;
    if (!target?.style) return;
    if (data.fixedHeader && !!data.fixedHeight) {
      target.style.minHeight = typeof data.scroll.y === 'string' ? data.scroll.y : '';
    } else {
      target.style.minHeight = '';
    }
  }, [data.fixedHeight, data.fixedHeader, data.scroll.y]);

  const renderTagList = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => <Tag key={`tag-${item}`}>{item}</Tag>);
    }
    return value;
  };

  // 前端分页
  useEffect(() => {
    if (useFrontPage) {
      let tempDataSource = [...dataSource];
      // 分页
      const len = data.paginationConfig.pageSize || data.paginationConfig.defaultPageSize || 1;
      const start = (data.paginationConfig.current - 1) * len;
      const end = start + len;
      data.paginationConfig.total = tempDataSource.length;
      setPageDataSource([...tempDataSource.slice(start, end)]);
    }
  }, [
    dataSource,
    data.usePagination,
    data.paginationConfig.current,
    data.paginationConfig.pageSize
  ]);

  const columnsRender = useCallback((value, ellipsis) => {
    return ellipsis ? (
      <Tooltip placement="topLeft" title={value}>
        <span className={styles.ellipsisWrap}>{value}</span>
      </Tooltip>
    ) : (
      <span>{value}</span>
    );
  }, []);

  const handleValueChange = debounce((value, schema, config) => {
    if (schema.useColumnChangeEvent) {
      outputs[OUTPUTS.ColumnChangeEvent]({
        value,
        rowKey: config?.record?.[rowKey]
      });
    }
  }, 200);

  const getColumns = (dataSource: DataSourceType[]) => {
    const col = formatColumn(data, env, colsCfg, validateValueExisting);
    return col.map((item, colIdx) => {
      const { disableScript } = item;
      switch (item.valueType) {
        case TypeEnum.Option:
          item.render = (_, record, idx, action) => {
            let editable = true;
            if (typeof item.editable === 'function') {
              editable = item.editable(_, record, idx);
            }
            const {
              addChildBtnScript,
              dynamicDisplayModifyBtnScript,
              dynamicDisplayDeleteBtnScript
            } = data;
            let showEditChildBtn = true,
              showDeleteChildBtn = true;

            const evaluateDisplayScript = (script: string | undefined, record: any) => {
              if (script) {
                try {
                  return eval(getTemplateRenderScript(script))(record);
                } catch (e) {
                  console.warn('Error executing script:', e);
                }
              }
              return true;
            };
            item.showAddChildBtn = evaluateDisplayScript(addChildBtnScript, record);
            showEditChildBtn = evaluateDisplayScript(dynamicDisplayModifyBtnScript, record);
            showDeleteChildBtn = evaluateDisplayScript(dynamicDisplayDeleteBtnScript, record);

            const onDelete = () => {
              if (env.edit) return;
              setDataSource(deleteItemByKey(dataSource, record?.[rowKey], rowKey));
              if (data.useDelCallback) {
                outputs[OUTPUTS.DelCallback](record);
              }
            };

            return [
              !data.hideModifyBtn && editable && data?.editText && showEditChildBtn && (
                <Button
                  key="editable"
                  className="editable"
                  type="link"
                  size="small"
                  onClick={(e) => {
                    if (env.edit) return;
                    action?.startEditable?.(record?.[rowKey]);
                    if (data?.useStateSwitching) {
                      outputs[OUTPUTS.StateSwitching]({
                        isEdit: true,
                        value: record
                      });
                    }
                    e.stopPropagation();
                  }}
                >
                  {data?.editText}
                </Button>
              ),
              !data.hideDeleteBtn &&
                data?.deleteText &&
                showDeleteChildBtn &&
                (data?.deleteSecondConfirm ? (
                  <Popconfirm
                    title={data?.deleteSecondConfirmText}
                    onConfirm={onDelete}
                    okText="确认"
                    cancelText="取消"
                    okButtonProps={{ danger: true }}
                  >
                    <Button key="delete" className="delete" type="link" size="small">
                      {data?.deleteText}
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    key="delete"
                    className="delete"
                    type="link"
                    size="small"
                    onClick={(e) => {
                      onDelete();
                      e.stopPropagation();
                    }}
                  >
                    {data?.deleteText}
                  </Button>
                )),
              !data.hideNewBtn && (
                <Button
                  key="add"
                  className="add"
                  type="link"
                  size="small"
                  onClick={(e) => {
                    if (env.edit) return;
                    actionRef.current?.addEditRecord?.({
                      [rowKey]: uuid(),
                      _add: true
                    });
                    e.stopPropagation();
                  }}
                >
                  新增
                </Button>
              ),
              !data.hideAllAddChildBtn &&
                data.addChildBtnLabel &&
                (!!env.edit || item.showAddChildBtn) && (
                  <Button
                    key="addChild"
                    className="addChild"
                    type="link"
                    size="small"
                    onClick={(e) => {
                      if (env.edit) return;
                      const newExpandedRowKeys = [...expandedRowKeys, record?.[rowKey]].filter(
                        (item, inx, self) => item && self.indexOf(item) === inx
                      );
                      setExpandedRowKeys(newExpandedRowKeys);
                      setDataSource(addChildByKey(dataSource, record?.[rowKey], rowKey));
                      e.stopPropagation();
                    }}
                  >
                    {data.addChildBtnLabel}
                  </Button>
                ),
              ...Actions(props, record, editableKeys, idx)
            ];
          };
          break;
        case TypeEnum.Slot as any:
          // 赋值插槽数据
          const extractValues = (record: { [x: string]: any; index: number }) => {
            const slotRowValue = {};
            let slotColValue = null;
            let rowIndex = record?._key || 0;

            for (let key in record) {
              if (key !== 'index') {
                slotRowValue[key] = record[key];
              }

              if (key === item.dataIndex) {
                slotColValue = record[key];
              }
            }

            rowIndex = dataSource.findIndex((item: any) => item?._key === record?._key);
            if (rowIndex === -1) {
              rowIndex = dataSource.length;
            }

            return { slotRowValue, slotColValue, rowIndex };
          };
          const SlotItem = (props) => {
            const { record, disabled, onChange } = props;
            if (!data.columns[colIdx][record?._key]) data.columns[colIdx][record?._key] = onChange;
            const renderValue = {
              inputValues: extractValues(record),
              key: `${record?._key}`
            };
            // 禁用或者编辑态插槽没有组件，则显示只读态插槽
            if (
              disabled ||
              (item?.slotEditId && slots[item.slotEditId] && slots[item.slotEditId].size === 0)
            ) {
              return (
                <>
                  {(item.slotId && slots[item.slotId] && slots[item.slotId].render(renderValue)) ||
                    null}
                </>
              );
            }
            return (
              <>
                {(item?.slotEditId &&
                  slots[item.slotEditId] &&
                  slots[item.slotEditId].render(renderValue)) ||
                  null}
              </>
            );
          };

          item.renderFormItem = (schema, config) => {
            const { entity } = schema as any;
            const { record } = config;
            return (
              <SlotItem
                record={{ ...entity, ...record }}
                disabled={runDisableScript(disableScript, record || entity)}
              />
            );
          };
          item.render = (_, record, idx, action) => {
            return (
              <div key={JSON.stringify(record[`${item.dataIndex}`])}>
                {item.slotId &&
                  slots[item.slotId] &&
                  slots[item.slotId].render({
                    inputValues: extractValues(record),
                    key: `${record?._key}-slotId`
                  })}
                {env.edit &&
                  item?.slotEditId &&
                  slots[item.slotEditId] &&
                  slots[item.slotEditId].render({
                    inputValues: extractValues(record),
                    key: `${record?._key}-slotEditId`
                  })}
              </div>
            );
          };
          break;
        case TypeEnum.Date:
          item.renderFormItem = (schema, config) => {
            const { entity } = schema as any;
            const { record } = config;

            return (
              <MyDatePicker
                disabled={runDisableScript(disableScript, record || entity)}
                placeholder={'请选择'}
                showTime={item.showTime}
                picker={item.datePicker || 'date'}
                format={
                  item.dateCustomShowFormatter === 'timeStamp'
                    ? null
                    : item.dateCustomShowFormatter || 'Y-MM-DD'
                }
                {...(item.fieldProps as any)}
                onChange={(value) => handleValueChange(value, schema, config)}
              />
              // <DatePicker
              //   disabled={runDisableScript(disableScript, record || entity)}
              //   placeholder={'请选择'}
              //   showTime={item.showTime}
              //   {...(item.fieldProps as any)}
              // />
            );
          };
          item.render = (_, record, idx, action) => {
            const dateCustomShowFormatter = item.dateCustomShowFormatter || 'Y-MM-DD';

            let oriValue = record[`${item.dataIndex}`];

            if (oriValue) {
              if (dateCustomShowFormatter === 'timeStamp') {
                oriValue = moment(oriValue).valueOf();
              } else {
                oriValue = moment(oriValue).format(dateCustomShowFormatter);
              }
            }

            return columnsRender(oriValue, item.ellipsis);
            // const format = item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';

            // const value = record[`${item.dataIndex}`]
            //   ? moment(record[`${item.dataIndex}`]).format(format)
            //   : // : '-';
            //     '';

            // return columnsRender(value, item.ellipsis);
          };
          break;
        case TypeEnum.Select:
          item.renderFormItem = (schema, config) => {
            const { entity } = schema as any;
            const { record } = config;
            return (
              <Select
                allowClear={true}
                style={{ width: '100%' }}
                placeholder={'请选择'}
                mode={item.multiple ? 'multiple' : undefined}
                showSearch={item.showSearch}
                optionFilterProp={item.optionFilterProp}
                disabled={runDisableScript(disableScript, record || entity)}
                {...(item.fieldProps as any)}
                onChange={(value) => handleValueChange(value, schema, config)}
              />
            );
          };
          item.render = (_, record, idx, action) => {
            const options = (item.fieldProps as any).options;
            const value = renderTagList(getValueByOptions(record[`${item.dataIndex}`], options));
            return columnsRender(value, item.ellipsis);
          };
          break;
        case TypeEnum.Cascader:
          item.renderFormItem = (schema, config) => {
            const { entity } = schema as any;
            const { record } = config;
            return (
              <Cascader
                placeholder={'请选择'}
                multiple={item.multiple}
                showSearch={item.showSearch}
                optionFilterProp={item.optionFilterProp}
                disabled={runDisableScript(disableScript, record || entity)}
                {...(item.fieldProps as any)}
                onChange={(value) => handleValueChange(value, schema, config)}
              />
            );
          };
          item.render = (_, record, idx, action) => {
            const value = record[`${item.dataIndex}`];
            const options = (item.fieldProps as any).options;
            const strList = getValueByOptions(value, options) || [];
            let returnDom = null;
            if (Array.isArray(strList)) {
              returnDom = renderTagList(
                item.multiple
                  ? strList.map((str) => (Array.isArray(str) ? str.join('/') : str))
                  : strList.join('/')
              );
            }
            return columnsRender(returnDom, item.ellipsis);
          };
          break;
        case TypeEnum.TreeSelect as any:
          item.renderFormItem = (schema, config) => {
            const { entity } = schema as any;
            const { record } = config;
            return (
              <TreeSelect
                placeholder={'请选择'}
                multiple={item.multiple}
                showSearch={item.showSearch}
                optionFilterProp={item.optionFilterProp}
                getPopupContainer={() => wrapRef.current as HTMLDivElement}
                treeNodeFilterProp="label"
                disabled={runDisableScript(disableScript, record || entity)}
                {...(item.fieldProps as any)}
                onChange={(value) => handleValueChange(value, schema, config)}
              />
            );
          };
          item.render = (_, record, idx, action) => {
            const options = (item.fieldProps as any).treeData;
            const value = renderTagList(getValueByOptions(record[`${item.dataIndex}`], options));
            return columnsRender(value, item.ellipsis);
          };
          break;
        case TypeEnum.Checkbox:
          item.renderFormItem = (schema, config) => {
            const { entity } = schema as any;
            const { record } = config;
            return (
              <Checkbox.Group
                disabled={runDisableScript(disableScript, record || entity)}
                {...(item.fieldProps as any)}
                onChange={(value) => handleValueChange(value, schema, config)}
              />
            );
          };
          item.render = (_, record, idx, action) => {
            const value = record[`${item.dataIndex}`];
            return (
              <div>
                <Checkbox.Group {...(item.fieldProps as any)} disabled={true} value={value} />
              </div>
            );
          };
          break;
        case TypeEnum.DateRange:
          item.renderFormItem = (schema, config) => {
            const { entity } = schema as any;
            const { record } = config;
            return (
              <RangePicker
                placeholder={['开始日期', '结束日期']}
                showTime={item.showTime}
                disabled={runDisableScript(disableScript, record || entity)}
                {...(item.fieldProps as any)}
                onChange={(value) => handleValueChange(value, schema, config)}
              />
            );
          };
          item.render = (_, record, idx, action) => {
            const value = Array.isArray(record[`${item.dataIndex}`])
              ? record[`${item.dataIndex}`].map((time) => moment(time).format(format)).join(' 至 ')
              : // : '-';
                '';
            const format = item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
            return columnsRender(value, item.ellipsis);
          };
          break;
        case TypeEnum.Text:
          item.renderFormItem = (schema, config) => {
            const { entity } = schema as any;
            const { record } = config;
            return (
              <Input
                disabled={runDisableScript(disableScript, record || entity)}
                {...(item.fieldProps as any)}
                onInput={(e) => handleValueChange(e.target.value, schema, config)}
              />
            );
          };
          item.render = (_, record, idx, action) => {
            const value = record[`${item.dataIndex}`];
            return columnsRender(value, item.ellipsis);
          };
          break;
        case TypeEnum.Number:
          item.renderFormItem = (schema, config) => {
            const { entity } = schema as any;
            const { record } = config;
            return (
              <InputNumber
                disabled={runDisableScript(disableScript, record || entity)}
                {...(item.fieldProps as any)}
                onChange={(value) => handleValueChange(value, schema, config)}
              />
            );
          };
          item.render = (_, record, idx, action) => {
            const value = record[`${item.dataIndex}`];
            return columnsRender(value, item.ellipsis);
          };
          break;
        case TypeEnum.Switch:
          item.renderFormItem = (schema, config) => {
            const { entity } = schema as any;
            const { record } = config;
            let defaultChecked: boolean;
            if (typeof !!entity?.[String(item?.dataIndex)] === 'boolean') {
              defaultChecked = entity?.[String(item?.dataIndex)];
            } else {
              defaultChecked = item.fieldProps?.['defaultChecked'];
            }
            return (
              <Switch
                defaultChecked={defaultChecked}
                disabled={runDisableScript(disableScript, record || entity)}
                {...(item.fieldProps as any)}
                onChange={(value) => handleValueChange(value, schema, config)}
              />
            );
          };
          item.render = (_, record, idx, action) => {
            const value = record[`${item.dataIndex}`];
            return (
              <div>
                <Switch
                  {...(item.fieldProps as any)}
                  checked={value}
                  onClick={() => {
                    return;
                  }}
                />
              </div>
            );
          };
          break;
        default:
          break;
      }
      return item;
    });
  };

  const customizeRenderEmpty = useCallback(
    () => CustomizeRenderEmpty(data.image, data.description, styles),
    [data.image, data.description]
  );

  // 勾选配置
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys: any[]) => {
      if (env.edit) return;
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  // 校验值是否出现过
  const validateValueExisting = useCallback(
    (value, dataIndex) => {
      let tempDataSource = [...dataSource];
      if (useFrontPage) {
        tempDataSource = [...pageDataSource];
      }
      if (tempDataSource && tempDataSource?.length > 0 && dataIndex && !isNullValue(value)) {
        // 如果是再次编辑
        if (
          tempDataSource.some(
            (item) =>
              String(item[dataIndex]) == String(value) && !editableKeys.includes(item[rowKey])
          )
        ) {
          return Promise.reject(new Error(`${dataIndex}值已经存在`));
        }
      }
      // 否则，返回成功的校验结果
      return Promise.resolve();
    },
    [dataSource, pageDataSource, data.usePagination, editableKeys]
  );

  const actionRender = useCallback(
    (row, config, defaultDoms) => {
      defaultDomsRef.current[row._key] = defaultDoms;
      return [
        !data.hideSaveBtn && defaultDoms.save && (
          <Button type="link" size="small" className="save">
            {data?.saveSecondConfirm ? (
              <Popconfirm
                title={data?.saveSecondConfirmText}
                okText="确认"
                cancelText="取消"
                okButtonProps={{ danger: true }}
                onConfirm={async () => {
                  await actionRef?.current?.saveEditable(row[rowKey]);
                }}
              >
                {data?.saveText}
              </Popconfirm>
            ) : (
              defaultDoms.save
            )}
          </Button>
        ),
        !data.hideDeleteBtnInEdit && defaultDoms.delete && (
          <Button type="link" size="small" className="delete">
            {defaultDoms.delete}
          </Button>
        ),
        !data.hideCancelBtn && defaultDoms.cancel && (
          <Button type="link" size="small" className="cancel">
            {defaultDoms.cancel}
          </Button>
        ),
        ...Actions(props, row, editableKeys)
      ].filter((item) => !!item);
    },
    [data.hideSaveBtn, data.hideDeleteBtnInEdit, data.hideCancelBtn, data.saveText]
  );

  // 实际的列
  const columns = useMemo(() => {
    return getColumns(dataSource).filter(
      (item) => item?.visible === true || item?.visible === undefined
    );
  }, [dataSource, data.columns, data.hideAllOperation]);

  useEffect(() => {
    Object.keys(defaultDomsRef.current).forEach((key) => {
      if (!editableKeys.includes(key)) {
        // 没有删除
        delete defaultDomsRef.current[key];
      }
    });
  }, [editableKeys]);

  return (
    <div
      className={`${styles['fz-editable-table']} ${
        env?.edit ? styles['fz-editable-table-event'] : ''
      }`}
      ref={wrapRef}
    >
      <Suspense fallback={<Spin tip="Loading..." />}>
        <ConfigProvider renderEmpty={data.isEmpty ? customizeRenderEmpty : void 0}>
          {columns?.length > 0 ? (
            <EditableProTable<DataSourceType>
              rowKey={rowKey}
              editableFormRef={editableFormRef}
              bordered={data.bordered}
              onRow={(record) => {
                return {
                  onClick: () => {
                    if (env.edit || !data.clickChangeToedit) return;
                    if (actionRef?.current?.preEditableKeys?.includes(record?.[rowKey])) {
                      return;
                    }
                    actionRef?.current?.startEditable?.(record?.[rowKey]);
                  }
                };
              }}
              recordCreatorProps={
                data.hideAddBtn
                  ? false
                  : {
                      newRecordType: data.useAutoSave ? 'dataSource' : 'cache',
                      creatorButtonText: data.creatorButtonText,
                      record: () => ({ [rowKey]: uuid(), _add: true }),
                      disabled: !!env?.edit
                    }
              }
              value={useFrontPage ? pageDataSource : dataSource}
              columns={columns}
              onChange={(value) => {
                if (useFrontPage) {
                  setDataSource(replacePageElements(dataSource, value, data.paginationConfig));
                } else {
                  setDataSource(value as DataSourceType[]);
                }
              }}
              scroll={{
                x: '100%',
                y: data?.scroll?.y ? data?.scroll?.y : void 0
              }}
              actionRef={actionRef}
              size={data.size || 'middle'}
              rowSelection={data.useRowSelection && rowSelection}
              tableAlertRender={false}
              expandable={{
                expandedRowKeys,
                onExpand: (expanded: boolean, record: DataSourceType) => {
                  const newExpandedRowKeys = expanded
                    ? [...expandedRowKeys, record?.[rowKey]]
                    : expandedRowKeys.filter((key) => key !== record?.[rowKey]);
                  setExpandedRowKeys(newExpandedRowKeys);
                }
              }}
              editable={{
                type: data.editType || 'multiple',
                editableKeys,
                onChange: setEditableRowKeys,
                onSave: (key, value) => {
                  if (data.useSaveCallback) {
                    outputs[OUTPUTS.SaveCallback](value);
                  }
                  if (data?.useStateSwitching) {
                    outputs[OUTPUTS.StateSwitching]({
                      isEdit: false,
                      value
                    });
                  }
                  return Promise.resolve();
                },
                saveText: data?.saveText,
                cancelText: data?.cancelText,
                onCancel: (key, value, originRow) => {
                  if (data?.useStateSwitching) {
                    outputs[OUTPUTS.StateSwitching]({
                      isEdit: false,
                      value: originRow
                    });
                  }
                  return Promise.resolve();
                },
                onDelete: (key, value) => {
                  if (data.useDelCallback) {
                    outputs[OUTPUTS.DelCallback](value);
                  }
                  return Promise.resolve();
                },
                actionRender,
                onValuesChange: (record, recordList: DataSourceType[]) => {
                  if (data.useAutoSave) {
                    const cb = () =>
                      setDataSource(
                        recordList
                          .filter((item) => !!item?._key)
                          .map((item, index) => ({ ...item, index }))
                      );
                    data.debounceAutoSaveTime ? debounce(cb, data.debounceAutoSaveTime) : cb();
                  }
                },
                onlyOneLineEditorAlertMessage: data?.onlyOneAlertMessage,
                onlyAddOneLineAlertMessage: data?.onlyOneAlertMessage
              }}
            />
          ) : (
            <Empty description="请添加列或连接数据源" />
          )}
          {data?.usePagination && (
            <Paginator
              env={env}
              parentSlot={props.parentSlot}
              data={data.paginationConfig}
              inputs={inputs}
              outputs={outputs}
            />
          )}
        </ConfigProvider>
      </Suspense>
    </div>
  );
}

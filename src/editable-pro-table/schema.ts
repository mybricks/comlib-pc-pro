import { ColumnItem, INPUTS, OUTPUTS, ROW_KEY, TypeEnum, ContentTypeEnum, Data } from './constants';

export function getColumnsDataSchema(columns: ColumnItem[], rowKey: string = ROW_KEY) {
  // const {} = columns
  const dataSchema = {
    [rowKey]: {
      type: 'string',
      title: '行唯一标识',
      description: '行标识字段，值需要全局唯一'
    }
  };
  columns.forEach((item) => {
    const { dataIndex, title, valueType } = item;
    if (valueType !== TypeEnum.Option) {
      dataSchema[`${dataIndex}`] = {
        type: item?.dataSchema?.type || 'string',
        // @ts-ignore
        title: item?.title,
        description: `表格列【${title}】的字段名为: ${dataIndex}${
          dataIndex === rowKey ? '，行标识字段，值需要全局唯一' : ''
        }`
      };
    }
  });
  return dataSchema;
}

// 设置输入数据schema
function setDataSourceSchema({ dataSchema, input, data, output }) {
  const ioPin = input.get(INPUTS.SetDataSource);
  const oPin = output.get(OUTPUTS.SetDataSourceDone);
  if (ioPin) {
    const TableDataSchema =
      data?.usePagination && !data.paginationConfig?.useFrontPage
        ? {
            title: '数据列表',
            type: 'object',
            properties: {
              dataSource: {
                type: 'array',
                description: '表格数据',
                items: {
                  type: 'object',
                  properties: dataSchema
                }
              },
              total: {
                type: 'number',
                description: '数据总数'
              },
              pageSize: {
                type: 'number',
                description: '表格每页条数'
              },
              pageNum: {
                type: 'number',
                description: '表格当前页码'
              }
            }
          }
        : {
            title: '表格数据',
            type: 'array',
            items: {
              type: 'object',
              properties: dataSchema
            }
          };
    ioPin.setSchema(TableDataSchema);
    oPin && oPin.setSchema(TableDataSchema);
  }
}
// 设置输出数据schema
function setDataSourceSubmitSchema({ dataSchema, output }) {
  const ioPin = output.get(OUTPUTS.Submit);
  if (ioPin) {
    ioPin.setSchema({
      title: '表格数据',
      type: 'array',
      items: {
        type: 'object',
        properties: dataSchema
      }
    });
  }
}
// 设置勾选输出数据schema
function setRowSelectionSchema({ dataSchema, output }) {
  const ioPin = output.get(OUTPUTS.GetRowSelect);
  if (ioPin) {
    ioPin.setSchema({
      title: '勾选数据',
      type: 'object',
      properties: {
        selectedRowKeys: {
          title: '勾选数据',
          type: 'array',
          items: {
            type: 'string'
          }
        },
        selectedRows: {
          title: '勾选行完整数据',
          type: 'array',
          items: {
            type: 'object',
            properties: dataSchema
          }
        }
      }
    });
  }
}

function getColumnsDataSchemaForConfig(columns: ColumnItem[]) {
  const dataSchema = {};
  columns.forEach((item) => {
    if (item.valueType === TypeEnum.Select) {
      dataSchema[`${item.dataIndex}`] = {
        type: 'object',
        properties: {
          options: {
            title: '下拉数据',
            type: 'array',
            items: {
              label: {
                title: '键名',
                type: 'string'
              },
              value: {
                title: '键值',
                type: 'any'
              }
            }
          }
        }
      };
    }
  });
  return dataSchema;
}
// 设置列配置scheme
function setColConfigSchema({ data, input }) {
  const ioPin = input.get(INPUTS.SetColConfig);
  if (ioPin) {
    ioPin.setSchema({
      title: '配置数据',
      type: 'object',
      properties: getColumnsDataSchemaForConfig(data.columns)
    });
  }
}

// 设置删除/新增schema
function setAddOrDelRowSchema({ dataSchema, input }) {
  const ioPin = input.get(INPUTS.AddRow);
  if (ioPin) {
    ioPin.setSchema({
      title: '行数据',
      type: 'object',
      properties: dataSchema
    });
  }

  const ioPin2 = input.get(INPUTS.DelRow);
  if (ioPin2) {
    ioPin2.setSchema({
      title: '行数据',
      type: 'object',
      properties: dataSchema
    });
  }

  const ioPin3 = input.get(INPUTS.MoveDown);
  if (ioPin3) {
    ioPin3.setSchema({
      title: '行数据',
      type: 'object',
      properties: dataSchema
    });
  }

  const ioPin4 = input.get(INPUTS.MoveUp);
  if (ioPin4) {
    ioPin4.setSchema({
      title: '行数据',
      type: 'object',
      properties: dataSchema
    });
  }
}

// 设置插槽行数据schema
function setSlotRowValueSchema({ dataSchema, slot, data }) {
  data.columns.forEach((column) => {
    if (column?.valueType === 'slot' && column?.slotId) {
      slot?.get(column?.slotId)?.inputs?.get(INPUTS.SlotRowValue)?.setSchema({
        type: 'object',
        properties: dataSchema
      });
    }
    if (column?.valueType === 'slot' && column?.slotEditId) {
      slot?.get(column?.slotEditId)?.inputs?.get(INPUTS.SlotRowValue)?.setSchema({
        type: 'object',
        properties: dataSchema
      });
      slot?.get(column?.slotEditId)?.outputs?.get(OUTPUTS.EditTableData)?.setSchema({
        type: 'object',
        properties: dataSchema
      });
    }
  });
}

// 设置插槽列数据schema
function setSlotColValueSchema({ slot, data }) {
  data.columns.forEach((column) => {
    if (column?.valueType === 'slot' && column?.slotId) {
      slot
        ?.get(column?.slotId)
        ?.inputs?.get(INPUTS.SlotColValue)
        ?.setSchema({
          title: column.dataIndex,
          type: column?.dataSchema?.type || 'string'
        });
    }
    if (column?.valueType === 'slot' && column?.slotEditId) {
      slot
        ?.get(column?.slotEditId)
        ?.inputs?.get(INPUTS.SlotColValue)
        ?.setSchema({
          title: column.dataIndex,
          type: column?.dataSchema?.type || 'string'
        });
    }
  });
}

// 设置插槽行序号数据schema
function setSlotRowIndexSchema({ slot, data }) {
  data.columns.forEach((column) => {
    if (column?.valueType === 'slot' && column?.slotId) {
      slot?.get(column?.slotId)?.inputs?.get(INPUTS.RowIndex)?.setSchema({
        title: column.dataIndex,
        type: 'number'
      });
    }
    if (column?.valueType === 'slot' && column?.slotEditId) {
      slot?.get(column?.slotEditId)?.inputs?.get(INPUTS.RowIndex)?.setSchema({
        title: column.dataIndex,
        type: 'number'
      });
    }
  });
}

// 操作scheme
export function getOptionSchema() {
  const properties = {};
  const options = [
    { key: 'useAutoSave', title: '自动保存' },
    { key: 'hideAllOperation', title: '隐藏所有操作' },
    { key: 'hideAddBtn', title: '隐藏新增按钮' },
    { key: 'hideDeleteBtn', title: '只读态-隐藏删除按钮' },
    { key: 'hideNewBtn', title: '只读态-隐藏新增按钮' },
    { key: 'hideDeleteBtnInEdit', title: '编辑态-隐藏删除啊扭' },
    { key: 'hideSaveBtn', title: '编辑态-隐藏保存按扭' },
    { key: 'hideCancelBtn', title: '编辑态-隐藏取消按扭' },
    { key: 'clickChangeToedit', title: '点击切换编辑态' }
  ];
  options.forEach(({ key, title }) => {
    properties[key] = { title, type: 'boolean' };
  });
  return {
    title: '操作配置',
    type: 'object',
    properties
  };
}

export function setDataSchema({ data, output, input, slot = {} }) {
  const dataSchema = getColumnsDataSchema(data.columns, data.rowKey);
  setDataSourceSchema({ dataSchema, input, data, output });
  setDataSourceSubmitSchema({ dataSchema, output });
  setRowSelectionSchema({ dataSchema, output });
  setColConfigSchema({ data, input });
  setAddOrDelRowSchema({ dataSchema, input });
  setSlotRowValueSchema({ dataSchema, slot, data });
  setSlotColValueSchema({ slot, data });
  setSlotRowIndexSchema({ slot, data });
}

export const Schemas = {
  Void: {
    type: 'any'
  },
  SetRowSelect: {
    type: 'array',
    items: {
      type: 'string'
    }
  },
  SetOpConfig: getOptionSchema(),
  AddRow: (data) => ({
    title: '行数据',
    type: 'object',
    properties: getColumnsDataSchema(data.columns, data.rowKey)
  }),
  DelRow: (data) => ({
    title: '行数据',
    type: 'object',
    properties: getColumnsDataSchema(data.columns, data.rowKey)
  }),
  MoveRow: (data) => ({
    title: '行数据',
    type: 'object',
    properties: getColumnsDataSchema(data.columns, data.rowKey)
  }),
  GetRowSelect: (data) => ({
    title: '勾选数据',
    type: 'object',
    properties: {
      selectedRowKeys: {
        title: '勾选数据',
        type: 'array',
        items: {
          type: 'string'
        }
      },
      selectedRows: {
        title: '勾选行完整数据',
        type: 'array',
        items: {
          type: 'object',
          properties: getColumnsDataSchema(data.columns, data.rowKey)
        }
      }
    }
  }),
  ChangeEvent: (data) => ({
    title: '表格数据',
    type: 'array',
    items: {
      type: 'object',
      properties: getColumnsDataSchema(data.columns, data.rowKey)
    }
  }),
  ColumnChangeEvent: () => ({
    title: '列值',
    type: 'object',
    properties: {
      rowKey: {
        desc: '当前行的key',
        type: 'string'
      },
      value: {
        desc: '值',
        type: 'any'
      }
    }
  }),
  StateSwitching: (data) => ({
    type: 'object',
    properties: {
      isEdit: {
        title: '状态',
        type: 'boolean'
      },
      value: {
        title: '表格数据',
        type: 'array',
        items: {
          type: 'object',
          properties: getColumnsDataSchema(data.columns, data.rowKey)
        }
      }
    }
  })
};

export const PageSchema = {
  type: 'object',
  properties: {
    pageNum: {
      type: 'number',
      description: '表格当前页码'
    },
    pageSize: {
      type: 'number',
      description: '表格每页条数'
    }
  }
};

export const slotEditInput = [
  { id: INPUTS.SlotRowValue, title: '当前行数据', schema: { type: 'object' } },
  { id: INPUTS.SlotColValue, title: '当前列数据', schema: { type: 'any' } },
  { id: INPUTS.RowIndex, title: '当前行序号', schema: { type: 'number' } }
];

export const slotEditOutput = [
  {
    id: OUTPUTS.EditTableData,
    title: '更新行数据',
    schema: { type: 'object' }
  }
];

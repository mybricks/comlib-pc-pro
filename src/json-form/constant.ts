import { ProFormLayoutType, SubmitterProps } from '@ant-design/pro-components';
import { FormProps } from 'antd';

export const InputIds = {
  SetColumns: 'setColumns',
  SetFieldsValue: 'setFieldsValue',
  Submit: 'submit'
};
export const OutputIds = {
  OnFinish: 'onFinish',
  OnFinishForRels: 'onFinishForRels',
  OnReset: 'onReset',
  OnValuesChange: 'onValuesChange'
};

export interface Data {
  layoutType: ProFormLayoutType;
  grid: boolean;
  submitter: false | SubmitterProps;
  config: FormProps;
}

export type DataItem = {
  name: string;
  state: string;
};

export const GridColumSchema = {
  colProps: {
    type: 'object'
  },
  rowProps: {
    type: 'object'
  }
};
export const BasicColumSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      key: {
        type: 'string'
      },
      title: {
        type: 'string'
      },
      tooltip: {
        type: 'string'
      },
      dataIndex: {
        type: 'string'
      },
      width: {
        type: 'string'
      },
      valueType: {
        type: 'enum',
        items: [
          {
            type: 'string',
            value: 'text'
          },
          {
            type: 'string',
            value: 'radio'
          },
          {
            type: 'string',
            value: 'checkbox'
          },
          {
            type: 'string',
            value: 'select'
          },
          {
            type: 'string',
            value: 'date'
          },
          {
            type: 'string',
            value: 'treeSelect'
          },
          {
            type: 'string',
            value: 'group'
          },
          {
            type: 'string',
            value: '其他各类表单项'
          }
        ]
      },
      valueEnum: {
        type: 'object',
        properties: {
          枚举映射: {
            type: 'object',
            properties: {
              text: {
                type: 'string'
              },
              status: {
                type: 'any'
              },
              disabled: {
                type: 'boolean'
              },
              checked: {
                type: 'boolean'
              }
            }
          }
        }
      },
      fieldProps: {
        type: 'object',
        properties: {
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: {
                  type: 'string'
                },
                value: {
                  type: 'any'
                },
                disabled: {
                  type: 'boolean'
                },
                checked: {
                  type: 'boolean'
                }
              }
            }
          },
          style: {
            type: 'object',
            properties: {
              width: 'number'
            }
          },
          其他需要直接传递给表单项内组件的配置: {
            type: 'any'
          }
        }
      },
      formItemProps: {
        type: 'object',
        properties: {
          rules: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                required: {
                  type: 'boolean'
                },
                message: {
                  type: 'string'
                }
              }
            }
          },
          其他需要直接传递给表单项整体的配置: {
            type: 'any'
          }
        }
      },
      dependencies: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      columns: {
        type: 'array',
        items: {
          type: 'object'
        }
      }
    }
  }
};

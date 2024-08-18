import { FormProps } from 'antd';
import { Data, InputIds, BasicColumSchema, GridColumSchema, OutputIds } from './constant';
import { deepCopy } from '../utils';

export default {
  ':root': [
    {
      title: '布局类型',
      type: 'Select',
      options() {
        return [
          { label: '基本表单', value: 'Form' },
          { label: '查询表单', value: 'QueryFilter' }
        ];
      },
      value: {
        get({ data, id, name }: EditorResult<Data>) {
          return data.layoutType;
        },
        set({ data, id, name }: EditorResult<Data>, value: Data['layoutType']) {
          data.layoutType = value;
        }
      }
    },
    {
      title: '表单项布局',
      type: 'Select',
      options: [
        { label: '水平', value: 'horizontal' },
        { label: '垂直', value: 'vertical' },
        { label: '内联', value: 'inline' }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.config?.layout;
        },
        set({ data }: EditorResult<Data>, value: FormProps['layout']) {
          data.config.layout = value;
        }
      }
    },
    {
      title: '一行多列(grid模式)',
      type: 'Switch',
      ifVisible({ data }: EditorResult<Data>) {
        return !['QueryFilter', 'LightFilter'].includes(data.layoutType || 'Form');
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.grid;
        },
        set({ data, input }: EditorResult<Data>, value: boolean) {
          data.grid = value;
          const schema = deepCopy(BasicColumSchema);
          if (value) {
            schema.items.properties = {
              ...schema.items.properties,
              ...GridColumSchema
            };
          }
          input.get(InputIds.SetColumns).setSchema(schema);
        }
      }
    },
    {
      title: '显示操作按钮',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return !!data.submitter;
        },
        set({ data }: EditorResult<Data>, value: Data['submitter']) {
          data.submitter = value;
        }
      }
    },
    {
      title: '数据提交',
      type: '_Event',
      options: {
        outputId: OutputIds.OnFinish
      }
    },
    {
      title: '重置输出',
      type: '_Event',
      options: {
        outputId: OutputIds.OnReset
      }
    },
    {
      title: '数据变化',
      type: '_Event',
      options: {
        outputId: OutputIds.OnValuesChange
      }
    }
  ]
};

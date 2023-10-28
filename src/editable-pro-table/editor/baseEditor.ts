import type { ProColumns } from '@ant-design/pro-table';
import { uuid } from '../../utils';
import { Data, INPUTS } from '../constants';
import { setDataSchema, getColumnsDataSchema } from '../schema';
import { emptyEditor } from './empty';

export default {
  title: '基础配置',
  items: [
    {
      title: '新增按钮文案',
      type: 'text',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.creatorButtonText;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.creatorButtonText = val;
        }
      }
    },
    {
      title: '添加列',
      type: 'button',
      value: {
        set({ data, output, input, slot }: EditorResult<Data>) {
          const item: ProColumns = {
            title: '新增',
            dataIndex: `${uuid()}`,
            valueType: 'text',
            width: 140,
            align: 'left',
            key: uuid(),
            fieldProps: {}
          };
          data.columns.splice(data.columns.length - 1, 0, item);
          setDataSchema({ data, output, input, slot });
        }
      }
    },
    ...emptyEditor
  ]
};

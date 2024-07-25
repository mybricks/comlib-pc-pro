import type { ProColumns } from '@ant-design/pro-table';
import { uuid } from '../../utils';
import {
  ColumnItem,
  ColumnsSchema,
  Data,
  INPUTS,
  InputIds,
  OutputIds,
  ROW_KEY,
  baseVerificationRules
} from '../constants';
import { setDataSchema } from '../schema';
import { emptyEditor } from './empty';

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

export default {
  title: '基础配置',
  items: [
    {
      title: '行唯一标识',
      type: 'text',
      description: '行唯一标识字段，默认为_key',
      options: {
        placeholder: ROW_KEY
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.rowKey;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.rowKey = value;
        }
      }
    },
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
      title: '分页模式',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data?.usePagination;
        },
        set({ data, input, output, ...res }: EditorResult<Data>, value: boolean) {
          data.usePagination = value;
          if (value) {
            input.add(InputIds.SetTotal, '设置数据总数', { type: 'number' });
            output.add(InputIds.SetTotal, '设置数据总数完成', { type: 'number' });
            input.get(InputIds.SetTotal).setRels([OutputIds.SetTotal]);
            input.add(InputIds.SetPageNum, '设置当前页码', { type: 'number' });
            output.add(OutputIds.SetPageNumFinish, '设置页码完成', { type: 'number' });
            input.get(InputIds.SetPageNum).setRels([OutputIds.SetPageNumFinish]);
            input.add(InputIds.GetPageInfo, '获取分页数据', { type: 'any' });
            output.add(OutputIds.GetPageInfo, '分页数据', PageSchema);
            input.get(InputIds.GetPageInfo).setRels([OutputIds.GetPageInfo]);
            output.add(OutputIds.PageChange, '点击分页', PageSchema);
          } else {
            input.remove(InputIds.SetTotal);
            output.remove(OutputIds.SetTotal);
            input.remove(InputIds.SetPageNum);
            output.remove(OutputIds.SetPageNumFinish);
            input.remove(InputIds.GetPageInfo);
            output.remove(InputIds.GetPageInfo);
            output.remove(OutputIds.PageChange);
          }
          setDataSchema({ data, input, output, ...res });
        }
      }
    },
    {
      title: '动态设置表头',
      type: 'Switch',
      description:
        '开启后，可以动态生成表格的各列，包括字段、标题、类型、宽度、数据源等。操作列除外。',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.dynamicColumns;
        },
        set({ data, input }: EditorResult<Data>, val: boolean) {
          data.dynamicColumns = val;
          if (val) {
            input.add({
              id: INPUTS.DynamicColumns,
              title: '设置表头',
              schema: ColumnsSchema,
              desc: '设置表格各列，包括字段、标题、类型、宽度、数据源等'
            });
          } else {
            input.remove(INPUTS.DynamicColumns);
          }
        }
      }
    },
    {
      title: '添加列',
      type: 'button',
      value: {
        set({ data, output, input, slot }: EditorResult<Data>) {
          const item: ColumnItem = {
            title: '新增',
            dataIndex: `${uuid()}`,
            valueType: 'text',
            width: 140,
            align: 'left',
            key: uuid(),
            fieldProps: {},
            VerificationRules: baseVerificationRules
          };
          data.columns.splice(data.columns.length - 1, 0, item);
          setDataSchema({ data, output, input, slot });
        }
      }
    },
    ...emptyEditor
  ]
};

import { ColumnsSchema, Data, INPUTS, InputIds, OutputIds, ROW_KEY } from '../constants';
import { setDataSchema, PageSchema } from '../schema';
import { emptyEditor } from './empty';

export default {
  title: '',
  items: [
    {
      title: '行唯一标识',
      type: 'text',
      description: '行唯一标识字段，默认为_key',
      options: {
        placeholder: ROW_KEY
      },
      ifVisible({ data }: EditorResult<Data>) {
        return typeof data?.hasUpdateRowKey === 'undefined';
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.rowKey;
        },
        set({ data, output, input, slot }: EditorResult<Data>, value: string) {
          data.rowKey = value;
          setDataSchema({ data, output, input, slot });
        }
      }
    },
    {
      title: '分页模式',
      type: 'Switch',
      description:
        '是否开启表格分页功能。开启后，传给输入项【设置数据源】的数据除了包含表格的列表数据，还需要包含分页信息total, pageSize, pageNum',
      value: {
        get({ data }: EditorResult<Data>) {
          return data?.usePagination;
        },
        set({ data, input, output, ...res }: EditorResult<Data>, value: boolean) {
          data.usePagination = value;
          if (value) {
            input.add(InputIds.SetTotal, '设置数据总数', { type: 'number' });
            output.add(OutputIds.SetTotal, '设置数据总数完成', { type: 'number' });
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
      title: '新增按钮文案',
      type: 'text',
      description: '配置新增一行按钮的文本',
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
    // {
    //   title: '添加列',
    //   type: 'button',
    //   description: '添加新的一列',
    //   value: {
    //     set({ data, output, input, slot }: EditorResult<Data>) {
    //       const item: ColumnItem = {
    //         title: '新增',
    //         dataIndex: `${uuid()}`,
    //         valueType: 'text',
    //         width: 140,
    //         align: 'left',
    //         key: uuid(),
    //         fieldProps: {},
    //         VerificationRules: baseVerificationRules
    //       };
    //       data.columns.splice(data.columns.length - 1, 0, item);
    //       setDataSchema({ data, output, input, slot });
    //     }
    //   }
    // },
    ...emptyEditor
  ]
};

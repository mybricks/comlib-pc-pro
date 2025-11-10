import { uuid } from '../../../utils';
import { Data, TypeEnum, TypeEnumMap, INPUTS, OUTPUTS, getColumnItem } from '../../constants';
import { setDataSchema, slotEditInput, slotEditOutput, getColumnsDataSchema } from '../../schema';

import { checkType, getCol, setCol } from '../../utils';
import createDataFormatEditor from '../../../utils/dataFormatter';
import noneFormatter from '../../../utils/dataFormatter/formatters/none';

const formatCode = encodeURIComponent(`
/**
 * 输入参数：
 *  - 当前列数据： value 
 *  - 当前行号：   index
 *  - 当前行数据:  rowRecord
 **/
({ value, index, rowRecord }) => {
  return value
}`);
//TODO

export default function baseEditor({data}) {
  return {
  title: '基础配置',
  items: [
    {
      title: '列名',
      type: 'text',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'title');
        },
        set({ data, output, input, focusArea, slot }: EditorResult<Data>, val: string) {
          setCol(data, focusArea, 'title', val);
          setDataSchema({ data, output, input, slot });
        }
      }
    },
    {
      title: '字段',
      type: 'text',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return checkType(data, focusArea, [], [TypeEnum.Option]);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'dataIndex');
        },
        set({ data, output, input, focusArea, slot }: EditorResult<Data>, val: string) {
          setCol(data, focusArea, 'dataIndex', val);
          setDataSchema({ data, output, input, slot });
        }
      }
    },
    {
      title: '类型',
      type: 'select',
      options: [
        { label: TypeEnumMap[TypeEnum.Text], value: TypeEnum.Text },
        { label: TypeEnumMap[TypeEnum.Number], value: TypeEnum.Number },
        { label: TypeEnumMap[TypeEnum.Select], value: TypeEnum.Select },
        { label: TypeEnumMap[TypeEnum.TreeSelect], value: TypeEnum.TreeSelect },
        { label: TypeEnumMap[TypeEnum.Cascader], value: TypeEnum.Cascader },
        { label: TypeEnumMap[TypeEnum.Switch], value: TypeEnum.Switch },
        { label: TypeEnumMap[TypeEnum.Checkbox], value: TypeEnum.Checkbox },
        { label: TypeEnumMap[TypeEnum.Date], value: TypeEnum.Date },
        { label: TypeEnumMap[TypeEnum.DateRange], value: TypeEnum.DateRange },
        { label: TypeEnumMap[TypeEnum.Slot], value: TypeEnum.Slot }
      ],
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return checkType(data, focusArea, [], [TypeEnum.Option]);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'valueType') || TypeEnum.Text;
        },
        set({ data, output, input, focusArea, slot }, val: string) {
          const slotId = getCol(data, focusArea, 'slotId') || uuid();
          const slotEditId = getCol(data, focusArea, 'slotEditId') || uuid();
          if (val === TypeEnum.Slot) {
            setCol(data, focusArea, 'slotId', slotId);
            setCol(data, focusArea, 'slotEditId', slotEditId);
            slot.add({
              id: slotId,
              title: `${getCol(data, focusArea, 'title')}列`,
              type: 'scope',
              inputs: slotEditInput
            });
            slot.add({
              id: slotEditId,
              title: `${getCol(data, focusArea, 'title')}列编辑态`,
              type: 'scope',
              inputs: slotEditInput,
              outputs: slotEditOutput
            });
          }
          if (val !== TypeEnum.Slot && slotId && slot.get(slotId)) {
            slot.remove(slotId);
            slot.remove(slotEditId);
          }
          setCol(data, focusArea, 'valueType', val);
          setDataSchema({ data, output, input, slot });
        }
      }
    },
    createDataFormatEditor({
      title: '格式转化',
      formatters: [
        {
          formatter: 'KEYMAP',
          options: {
            locale: true,
          }
        },
        {
          formatter: 'EXPRESSION',
          description: '表达式输出内容为字符串，在花括号内可以引用变量并进行简单处理',
          options: {
            placeholder: '如：当前是第{index+1}行，列数据为{value}, 行数据为{rowRecord}',
            suggestions: [
              {
                label: 'value',
                detail: '当前列数据'
              },
              {
                label: 'rowRecord',
                detail: '当前行数据',
                properties:  getColumnsDataSchema(data.columns, data.rowKey)
              },
              {
                label: 'index',
                detail: '当前行序号'
              }
            ]
          }
        },
        {
          formatter: 'TIMETEMPLATE',
          defaultValue: 'YYYY-MM-DD HH:mm:ss'
        },
        {
          formatter: 'CUSTOMTIME',
          defaultValue: 'YYYY-MM-DD HH:mm:ss'
        },
        {
          formatter: 'CUSTOMSCRIPT',
          defaultValue: formatCode
        }
      ],
      value: {
        get({ data, focusArea }) {
          if (!focusArea) return;
          return getCol(data, focusArea, 'formatData') || {
            formatterName: noneFormatter.name,
            values: {}
          };
        },
        set({ data, focusArea }, value) {
          if (!focusArea) return;
          setCol(data, focusArea, 'formatData', value);
        }
      }
    }),
    {
      title: '列数据类型',
      type: '_schema',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return checkType(data, focusArea, [], [TypeEnum.Option]);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          const item = getColumnItem(data, focusArea);
          return item?.dataSchema || { type: 'string' };
        },
        set({ data, output, input, focusArea, slot }: EditorResult<Data>, value: object) {
          if (!focusArea) return;
          setCol(data, focusArea, 'dataSchema', value);
          setDataSchema({ data, output, input, slot });
        }
      }
    }
    ]
  };
}

import { Data, TypeEnum } from '../../constants';
import { checkType, getCol, getSuggestions, run, setCol } from '../../utils';

export default (data: Data) => ({
  title: '状态配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    return checkType(data, focusArea, [], [TypeEnum.Option]);
  },
  items: [
    {
      title: '必填',
      type: 'Switch',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return checkType(data, focusArea, [
          TypeEnum.Text,
          TypeEnum.Select,
          TypeEnum.Date,
          TypeEnum.DateRange,
          TypeEnum.Checkbox,
          TypeEnum.Number,
          TypeEnum.Cascader,
          TypeEnum.TreeSelect,
          TypeEnum.Slot
        ]);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'required');
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          setCol(data, focusArea, 'required', value);
        }
      }
    },
    {
      title: '不能重复',
      type: 'Switch',
      description: `该列字段的值在数据数组每一行不能重复`,
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return !checkType(data, focusArea, [TypeEnum.Slot, TypeEnum.Switch]);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'repeat');
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          setCol(data, focusArea, 'repeat', value);
        }
      }
    },
    {
      title: '校验失败样式',
      type: 'Select',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return (
          checkType(data, focusArea, [
            TypeEnum.Text,
            TypeEnum.Select,
            TypeEnum.Date,
            TypeEnum.DateRange,
            TypeEnum.Checkbox,
            TypeEnum.Number,
            TypeEnum.Cascader,
            TypeEnum.TreeSelect,
            TypeEnum.Slot
          ]) &&
          (getCol(data, focusArea, 'required') || getCol(data, focusArea, 'repeat'))
        );
      },
      options: [
        { value: 'default', label: '围绕' },
        { value: 'popover', label: '气泡' }
      ],
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'errorType') || 'popover';
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          setCol(data, focusArea, 'errorType', value);
        }
      }
    },
    {
      title: '只读',
      type: 'Switch',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return checkType(data, focusArea, [], [TypeEnum.Option]);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'readonly');
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          setCol(data, focusArea, 'readonly', value);
        }
      }
    },
    {
      title: '动态禁用',
      description: `根据表格列字段值在编辑态下动态禁用该列的表达式，支持（{}, =, <, >, ||, &&）, 例：{title} === '1'`,
      type: 'EXPRESSION',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return !getCol(data, focusArea, 'readonly');
      },
      options: {
        autoSize: true,
        placeholder: `例：{title} === '1'`,
        suggestions: getSuggestions(data),
        runCode: run
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'disableScript');
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          setCol(data, focusArea, 'disableScript', value);
        }
      }
    }
  ]
});

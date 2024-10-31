import { Data, TypeEnum } from '../../constants';
import { checkType, getCol, getSuggestions, run, setCol } from '../../utils';
import { baseVerificationRules } from '../../constants';
import { defaultValidatorExample } from '../../../utils';

export default (data: Data) => ({
  title: '状态配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    return checkType(data, focusArea, [], [TypeEnum.Option]);
  },
  items: [
    {
      title: '必填',
      type: 'Switch',
      description: `该列必须有值才能保存`,
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
          // return getCol(data, focusArea, 'VerificationRules')?.[0]?.status || false;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          setCol(data, focusArea, 'required', value);
          let newVerificationRules = getCol(data, focusArea, 'VerificationRules');
          // 兼容组件没有升级，但升级了组件库
          if (newVerificationRules) {
            newVerificationRules = JSON.parse(
              JSON.stringify(getCol(data, focusArea, 'VerificationRules'))
            );
            newVerificationRules[0].status = value;
            setCol(data, focusArea, 'VerificationRules', newVerificationRules);
          }
        }
      }
    },
    {
      title: '不能重复',
      type: 'Switch',
      description: `该列字段的值在数据数组每一行不能重复`,
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return (
          !checkType(data, focusArea, [TypeEnum.Slot, TypeEnum.Switch]) &&
          !!getCol(data, focusArea, 'VerificationRules')
        );
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'VerificationRules')?.[1]?.status || false;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          const newVerificationRules = JSON.parse(
            JSON.stringify(getCol(data, focusArea, 'VerificationRules'))
          );
          newVerificationRules[1].status = value;
          setCol(data, focusArea, 'VerificationRules', newVerificationRules);
        }
      }
    },
    {
      title: '代码校验',
      type: 'Switch',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return !!getCol(data, focusArea, 'VerificationRules');
      },
      value: {
        get({ data, focusArea }) {
          return getCol(data, focusArea, 'VerificationRules')?.[2]?.status || false;
        },
        set({ data, focusArea }, value) {
          const newVerificationRules = JSON.parse(
            JSON.stringify(getCol(data, focusArea, 'VerificationRules'))
          );

          // 兼容
          if (!newVerificationRules[2]) {
            newVerificationRules[2] = {
              ...baseVerificationRules[2]
            };
          }

          newVerificationRules[2].status = value;
          setCol(data, focusArea, 'VerificationRules', newVerificationRules);
        }
      }
    },
    {
      title: '编辑校验代码',
      type: 'Code',
      description: `编辑校验代码，支持自定义校验逻辑`,
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return !!getCol(data, focusArea, 'VerificationRules')?.[2]?.status;
      },
      options: {
        babel: true,
        comments: defaultValidatorExample,
        theme: 'light',
        minimap: {
          enabled: false
        },
        lineNumbers: 'on',
        eslint: {
          parserOptions: {
            ecmaVersion: '2020',
            sourceType: 'module'
          }
        },
        autoSave: true
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'VerificationRules')?.[2]?.code || '';
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          const newVerificationRules = JSON.parse(
            JSON.stringify(getCol(data, focusArea, 'VerificationRules'))
          );
          newVerificationRules[2].code = value;
          setCol(data, focusArea, 'VerificationRules', newVerificationRules);
        }
      }
    },
    {
      title: '校验失败样式',
      type: 'Select',
      description: `配置校验失败时样式`,
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
      description: `开启后本列编辑态只读，禁止编辑，可以开启所有列的只读实现整个表格只读`,
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

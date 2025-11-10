import { Data, TypeEnum } from '../../constants';
import { checkType, getCol, setCol } from '../../utils';
import indexEditor from '../indexEditor';
import baseEditor from './baseEditor';
import styleEditor from './styleEditor';
import newStyleEditor from './newStyleEditor';
import switchEditor from './switchEditor';
import TitleTipEditor from './tooltips';
import operationRowEditor from './operationRowEditor';
import dateEditor from './dateEditor';
import selectEditor from './selectEditor';
import proEditor from './proEditor';
import PaginatorEditor from './paginator';
import { uuid } from '../../../utils';
import columnEvents from './columnEvents';

export const COLUMN_EDITORS_CLASS_KEY =
  '.ant-table-thead .ant-table-cell:not(.ant-table-selection-column):not(.ant-table-cell-scrollbar):not(.ant-table-row-expand-icon-cell):not(.column-draggle)';
export default {
  [COLUMN_EDITORS_CLASS_KEY]: {
    title: '表格列',
    items: ({ data, output }: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [
        baseEditor({data}),
        {
          title: '枚举数据源',
          type: 'array',
          description: '配置下拉框、多选框的默认数据源',
          options: {
            addText: '添加枚举值',
            editable: true,
            draggable: true,
            getTitle(item) {
              return `${item.label} - ${item.value}`;
            },
            onAdd() {
              const value = uuid();
              return {
                label: '选项',
                value
              };
            },
            items: [
              {
                title: '选项标签',
                type: 'text',
                value: 'label'
              },
              {
                title: '选项值',
                type: 'valueSelect',
                options: ['text', 'number', 'boolean'],
                description: '选项的唯一标识，可以修改为有意义的值',
                value: 'value'
              }
            ]
          },
          ifVisible({ data, focusArea }: EditorResult<Data>) {
            return checkType(data, focusArea, [TypeEnum.Select, TypeEnum.Checkbox]);
          },
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              return getCol(data, focusArea, 'valueEnum');
            },
            set({ data, focusArea }: EditorResult<Data>, val: Array<any>) {
              setCol(data, focusArea, 'valueEnum', val);
            }
          }
        },
        indexEditor
      ];

      cate2.title = '高级';
      cate2.items = [
        proEditor(data),
        operationRowEditor(data, output),
        switchEditor,
        dateEditor,
        selectEditor,
        columnEvents
      ];

      return {
        title: '列'
      };
    },
    style: [styleEditor, TitleTipEditor, ...newStyleEditor]
  },
  ...PaginatorEditor
};

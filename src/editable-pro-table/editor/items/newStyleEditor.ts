import { Data, TypeEnum } from '../../constants';
import { checkType, getFilterSelector } from '../../utils';

const createButtonEditor = ({ title, catelog, ifVisible, target, domTarget = '' }) => {
  return {
    title,
    catelog,
    ifVisible,
    options: [
      { type: 'font', config: { disableTextAlign: true } },
      'border',
      { type: 'background', config: { disableBackgroundImage: true } }
    ],
    target,
    domTarget
  };
};

export default [
  {
    title: '操作列样式',
    items: [
      {
        title: '表头',
        catelog: '默认',
        options: [
          { type: 'font', config: { disableTextAlign: true } },
          'border',
          { type: 'background', config: { disableBackgroundImage: true } }
        ],
        target: ({ focusArea, id }: EditorResult<Data>) => {
          const { tableThIdx } = focusArea.dataset;
          const selector = `table thead tr th[data-table-th-idx="${tableThIdx}"]${getFilterSelector(
            id
          )}`;
          return selector;
        }
      },
      {
        title: '表格内容',
        catelog: '默认',
        options: [
          { type: 'font', config: { disableTextAlign: true } },
          'border',
          { type: 'background', config: { disableBackgroundImage: true } }
        ],
        target: ({ focusArea, id }: EditorResult<Data>) => {
          const { tableThIdx } = focusArea.dataset;
          const selector = `table tbody tr td[data-table-column-id="${tableThIdx}"]${getFilterSelector(
            id
          )}`;
          return selector;
        }
      },
      createButtonEditor({
        title: '编辑按钮',
        catelog: '默认',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkType(data, focusArea, [TypeEnum.Option]) && !data.hideModifyBtn;
        },
        target: `.ant-space-item > .editable`
      }),
      createButtonEditor({
        title: '删除按钮',
        catelog: '默认',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkType(data, focusArea, [TypeEnum.Option]) && !data.hideDeleteBtn;
        },
        target: `.ant-space-item > .delete`
      }),
      createButtonEditor({
        title: '新增按钮',
        catelog: '默认',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkType(data, focusArea, [TypeEnum.Option]) && !data.hideNewBtn;
        },
        target: `.ant-space-item > .add`
      }),
      createButtonEditor({
        title: '添加子按钮',
        catelog: '默认',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkType(data, focusArea, [TypeEnum.Option]) && !data.hideAllAddChildBtn;
        },
        target: `.ant-space-item > .addChild`
      }),
      createButtonEditor({
        title: '编辑按钮',
        catelog: 'Hover',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkType(data, focusArea, [TypeEnum.Option]) && !data.hideModifyBtn;
        },
        target: `.ant-space-item > .editable:hover`,
        domTarget: '.ant-space-item > .editable'
      }),
      createButtonEditor({
        title: '删除按钮',
        catelog: 'Hover',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkType(data, focusArea, [TypeEnum.Option]) && !data.hideDeleteBtn;
        },
        target: `.ant-space-item > .delete:hover`,
        domTarget: '.ant-space-item > .delete'
      }),
      createButtonEditor({
        title: '新增按钮',
        catelog: 'Hover',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkType(data, focusArea, [TypeEnum.Option]) && !data.hideNewBtn;
        },
        target: `.ant-space-item > .add:hover`,
        domTarget: '.ant-space-item > .add'
      }),
      createButtonEditor({
        title: '添加子按钮',
        catelog: 'Hover',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkType(data, focusArea, [TypeEnum.Option]) && !data.hideAllAddChildBtn;
        },
        target: `.ant-space-item > .addChild:hover`,
        domTarget: '.ant-space-item > .addChild'
      })
    ]
  }
];

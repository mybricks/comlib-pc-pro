import { Data } from './constants';
import operationEditor from './editor/operationEditor';
import itemsEditor from './editor/items';
import baseEditor from './editor/baseEditor';
import styleEditor from './editor/styleEditor';
import { StylesEditor } from './editor/items/stylesEditor';
import getAddColumnEditor from './editor/addColumn';
import { setDataSchema } from './schema';

export default {
  '@init': ({ data, input, output, slot }: EditorResult<Data>) => {
    setDataSchema({ data, input, output, slot });
  },
  '@resize': {
    options: ['width']
  },
  ':root': {
    title: '可编辑表格',
    items: (props: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [getAddColumnEditor(props), baseEditor];

      cate2.title = '高级';
      cate2.items = [...operationEditor];

      return { title: '可编辑表格' };
    },

    style: [...styleEditor.items]
  },
  ...itemsEditor,
  '[data-form-actions-item]': {
    title: '操作',
    style: [
      ...StylesEditor,
      {
        items: [
          {
            options: ['size'],
            catelog: '默认',
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]`;
            }
          },
          // {
          //   title: '内置图标',
          //   catelog: '默认',
          //   options: [{ type: 'font', config: { disableTextAlign: true } }],
          //   target({ focusArea, data }) {
          //     if (!focusArea) return;
          //     const comId = focusArea.dataset['formActionsItem'];
          //     const btn = data.actions.find((item) => item.key === comId);

          //     if (!btn) return;
          //     return `button[data-form-actions-item="${btn.key}"] .anticon`;
          //   }
          // },
          // {
          //   title: '自定义图标',
          //   catelog: '默认',
          //   options: ['size'],
          //   target({ focusArea, data }) {
          //     if (!focusArea) return;
          //     const comId = focusArea.dataset['formActionsItem'];
          //     const btn = data.actions.find((item) => item.key === comId);

          //     if (!btn) return;
          //     return `button[data-form-actions-item="${btn.key}"] .ant-image-img`;
          //   }
          // },
          {
            title: '按钮',
            catelog: '默认',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]`;
            }
          },
          {
            title: '按钮',
            catelog: 'Hover',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]:hover`;
            }
          },
          // {
          //   title: '内置图标',
          //   catelog: 'Hover',
          //   options: [{ type: 'font', config: { disableTextAlign: true } }],
          //   target({ focusArea, data }) {
          //     if (!focusArea) return;
          //     const comId = focusArea.dataset['formActionsItem'];
          //     const btn = data.actions.find((item) => item.key === comId);

          //     if (!btn) return;
          //     return `button[data-form-actions-item="${btn.key}"]:hover .anticon`;
          //   }
          // },
          // {
          //   title: '自定义图标',
          //   catelog: 'Hover',
          //   options: ['size'],
          //   target({ focusArea, data }) {
          //     if (!focusArea) return;
          //     const comId = focusArea.dataset['formActionsItem'];
          //     const btn = data.actions.find((item) => item.key === comId);

          //     if (!btn) return;
          //     return `button[data-form-actions-item="${btn.key}"]:hover .ant-image-img`;
          //   }
          // },
          {
            title: '按钮',
            catelog: '激活',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]:active`;
            }
          },
          // {
          //   title: '内置图标',
          //   catelog: '激活',
          //   options: [{ type: 'font', config: { disableTextAlign: true } }],
          //   target({ focusArea, data }) {
          //     if (!focusArea) return;
          //     const comId = focusArea.dataset['formActionsItem'];
          //     const btn = data.actions.find((item) => item.key === comId);

          //     if (!btn) return;
          //     return `button[data-form-actions-item="${btn.key}"]:active .anticon`;
          //   }
          // },
          // {
          //   title: '自定义图标',
          //   catelog: '激活',
          //   options: [{ type: 'font', config: { disableTextAlign: true } }],
          //   target({ focusArea, data }) {
          //     if (!focusArea) return;
          //     const comId = focusArea.dataset['formActionsItem'];
          //     const btn = data.actions.find((item) => item.key === comId);

          //     if (!btn) return;
          //     return `button[data-form-actions-item="${btn.key}"]:active .ant-image-img`;
          //   }
          // },
          {
            title: '按钮',
            catelog: '禁用',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"].ant-btn[disabled]`;
            }
          }
          // {
          //   title: '内置图标',
          //   catelog: '禁用',
          //   options: [{ type: 'font', config: { disableTextAlign: true } }],
          //   target({ focusArea, data }) {
          //     if (!focusArea) return;
          //     const comId = focusArea.dataset['formActionsItem'];
          //     const btn = data.actions.find((item) => item.key === comId);

          //     if (!btn) return;
          //     return `button[data-form-actions-item="${btn.key}"].ant-btn[disabled] .anticon`;
          //   }
          // },
          // {
          //   title: '自定义图标',
          //   catelog: '激活',
          //   options: [{ type: 'font', config: { disableTextAlign: true } }],
          //   target({ focusArea, data }) {
          //     if (!focusArea) return;
          //     const comId = focusArea.dataset['formActionsItem'];
          //     const btn = data.actions.find((item) => item.key === comId);

          //     if (!btn) return;
          //     return `button[data-form-actions-item="${btn.key}"].ant-btn[disabled] .ant-image-img`;
          //   }
          // }
        ]
      }
    ],
    items: ({ data, output, focusArea }: EditorResult<Data>, cate1, cate2, cate3) => {
      if (!focusArea) return;
      const comId = focusArea.dataset['formActionsItem'];
      const btn = data.actions.find((item) => item.key === comId);

      if (!btn) return;

      cate1.title = '操作';
      cate1.items = [
        {
          title: '显示',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return btn.visible;
            },
            set({ data }: EditorResult<Data>, val) {
              btn.visible = val;
              data.actions = [...data.actions];
            }
          }
        },
        // TODO
        // {
        //   title: '动态显示表达式',
        //   type: 'expression',
        //   options: {
        //     // suggestions: getSuggestions(data),
        //     placeholder: `例：{item.index < 4}`
        //   },
        //   value: {
        //     get({ data }: EditorResult<Data>) {
        //       return btn.displayExpression;
        //     },
        //     set({ data }: EditorResult<Data>, val: string) {
        //       btn.displayExpression = val;
        //     }
        //   }
        // },
        {
          title: '标题',
          type: 'text',
          options: {
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return btn.title;
            },
            set({ data, output }: EditorResult<Data>, val) {
              btn.title = val;
              output.setTitle(btn.outputId, `点击${btn.title}`);
              data.actions = [...data.actions];
            }
          }
        },
        {
          title: '事件',
          items: [
            {
              title: '点击',
              type: '_event',
              options({ data }) {
                return {
                  outputId: btn.outputId
                  // slotId: SlotIds.FormItems
                };
              }
            }
          ]
        },
        {
          title: '删除',
          type: 'Button',
          ifVisible({ data }) {
            return !btn?.isDefault;
          },
          value: {
            set({ data, output, focusArea }: EditorResult<Data>) {
              const itemId = focusArea.dataset['formActionsItem'];
              const index = data.actions.findIndex((item) => item.key === itemId);
              output.remove(btn.outputId);
              if (index !== -1) {
                data.actions.splice(index, 1);
              }
              data.actions = [...data.actions];
            }
          }
        }
      ];

      // TODO
      // cate2.title = '高级';
      // cate2.items = [
      //   {
      //     title: '权限信息配置',
      //     description: '权限信息配置',
      //     type: '_permission',
      //     options: {
      //       placeholder: '不填写，默认无权限校验'
      //     },
      //     value: {
      //       get({ data, focusArea }: EditorResult<Data>) {
      //         return btn.permission;
      //       },
      //       set({ data, focusArea }: EditorResult<Data>, value: ConfigPermission) {
      //         btn.permission = value;
      //         value.register?.();
      //       }
      //     }
      //   },
      // ];
    }
  }
};

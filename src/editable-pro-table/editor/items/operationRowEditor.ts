import { Action, Data, OUTPUTS, TypeEnum } from '../../constants';
import { getColumnsDataSchema } from '../../schema';
import { checkType, getSuggestions, run } from '../../utils';
import { uuid } from '../../../utils';
import VisibleOpt from '../../../components/editorRender/visibleOpt';

export default (data: Data, output) => ({
  title: '操作列配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    return checkType(data, focusArea, [TypeEnum.Option]);
  },
  items: [
    {
      title: '隐藏操作列',
      description: '隐藏操作列，会自动隐藏所有操作',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.hideAllOperation;
        },
        set({ data }: EditorResult<Data>, val: boolean) {
          data.hideAllOperation = !!val;
        }
      }
    },
    {
      title: '自定义操作',
      description: '选中拖拽各项左侧手柄，可改变按钮的相对位置',
      type: 'array',
      options: {
        addText: '添加操作',
        deletable: false,
        editable: false,
        customOptRender: VisibleOpt,
        getTitle: (item) => {
          return item?.title;
        },
        onAdd: (_id) => {
          const outputId = uuid();
          const title = `自定义操作${data.actions.length + 1}`;
          const item = {
            title: title,
            key: outputId,
            outputId,
            isDefault: false,
            visible: true,
            type: 'link',
            size: 'small',
            iconConfig: {
              src: false,
              size: [14, 14],
              gutter: 8,
              location: 'front'
            }
          } as Action;
          // const itemSchema = getItemSchema(data);
          const recordSchema = getColumnsDataSchema(data.columns, data.rowKey);

          const actionSchema = {
            type: 'object',
            properties: {
              index: {
                type: 'number',
                title: '行索引'
              },
              isEdit: {
                type: 'boolean',
                title: '是否编辑态'
              },
              record: {
                type: 'object',
                properties: {
                  ...recordSchema
                }
              }
            }
          };
          output.add(outputId, `点击${title}`, actionSchema);
          data.actions.push(item);
          return item;
        }
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.actions || [];
        },
        set({ data }: EditorResult<Data>, val: any[]) {
          data.actions = val;
        }
      }
    },
    {
      title: '只读态操作',
      description: '配置只读状态下操作列按钮',
      ifVisible({ data }: EditorResult<Data>) {
        return !data.hideAllOperation;
      },
      items: [
        {
          title: '隐藏编辑按钮',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.hideModifyBtn;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.hideModifyBtn = !!val;
            }
          }
        },
        {
          title: '编辑按钮文案',
          type: 'text',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideModifyBtn;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data?.editText;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.editText = val;
            }
          }
        },
        {
          title: '动态显示编辑按钮表达式',
          description: `通过表格行字段值，动态控制编辑按钮按钮的显隐，不设置则默认显示。表达式支持（{}, =, <, >, ||, &&）, 例：{title} === '1'`,
          type: 'EXPRESSION',
          options: {
            autoSize: true,
            placeholder: `例：{title} === '1'`,
            suggestions: getSuggestions(data),
            runCode: run
          },
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideModifyBtn;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data?.dynamicDisplayModifyBtnScript;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.dynamicDisplayModifyBtnScript = val;
            }
          }
        },
        {
          title: '隐藏删除按钮',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.hideDeleteBtn;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.hideDeleteBtn = !!val;
            }
          }
        },
        {
          title: '动态显示删除按钮表达式',
          description: `通过表格行字段值，动态控制删除按钮按钮的显隐，不设置则默认显示。表达式支持（{}, =, <, >, ||, &&）, 例：{title} === '1'`,
          type: 'EXPRESSION',
          options: {
            autoSize: true,
            placeholder: `例：{title} === '1'`,
            suggestions: getSuggestions(data),
            runCode: run
          },
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideDeleteBtn;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data?.dynamicDisplayDeleteBtnScript;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.dynamicDisplayDeleteBtnScript = val;
            }
          }
        },
        {
          title: '删除二次确认',
          type: 'switch',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideDeleteBtn;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data?.deleteSecondConfirm;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.deleteSecondConfirm = !!val;
            }
          }
        },
        {
          title: '删除二次确认文案',
          type: 'text',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideDeleteBtn && data?.deleteSecondConfirm;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data?.deleteSecondConfirmText;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.deleteSecondConfirmText = val;
            }
          }
        },
        {
          title: '隐藏添加按钮',
          type: 'switch',
          description: `开启后，会隐藏所有表格行操作列的新增按钮`,
          value: {
            get({ data }: EditorResult<Data>) {
              return data.hideNewBtn;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.hideNewBtn = !!val;
            }
          }
        },
        {
          title: '隐藏添加子项按钮',
          description: `开启后，会隐藏所有表格行的添加子项按钮`,
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              if (data.hideAllAddChildBtn === undefined) {
                data.hideAllAddChildBtn = true;
              }
              return data.hideAllAddChildBtn;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.hideAllAddChildBtn = !!val;
            }
          }
        },
        {
          title: '添加子项按钮文案',
          type: 'text',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideAllAddChildBtn;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              if (!data.addChildBtnLabel) {
                data.addChildBtnLabel = '添加子项';
              }
              return data.addChildBtnLabel;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.addChildBtnLabel = val;
            }
          }
        },
        {
          title: '添加子项按钮显示',
          description: `通过表格行字段值，动态控制添加子项按钮的显隐，不设置则默认显示。表达式支持（{}, =, <, >, ||, &&）, 例：{title} === '1'`,
          type: 'EXPRESSION',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideAllAddChildBtn;
          },
          options: {
            autoSize: true,
            placeholder: `例：{title} === '1'`,
            suggestions: getSuggestions(data),
            runCode: run
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data?.addChildBtnScript;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.addChildBtnScript = value;
            }
          }
        }
      ]
    },
    {
      title: '编辑态操作',
      description: '配置编辑状态下操作列按钮',
      ifVisible({ data }: EditorResult<Data>) {
        return !data.hideAllOperation;
      },
      items: [
        {
          title: '隐藏保存按钮',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.hideSaveBtn;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.hideSaveBtn = !!val;
            }
          }
        },
        {
          title: '保存按钮文案',
          type: 'text',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideSaveBtn;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data?.saveText;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.saveText = val;
            }
          }
        },
        {
          title: '保存二次确认',
          type: 'switch',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideSaveBtn;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data?.saveSecondConfirm;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.saveSecondConfirm = !!val;
            }
          }
        },
        {
          title: '保存二次确认文案',
          type: 'text',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideSaveBtn && data?.saveSecondConfirm;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data?.saveSecondConfirmText;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.saveSecondConfirmText = val;
            }
          }
        },
        {
          title: '隐藏删除按钮',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.hideDeleteBtnInEdit;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.hideDeleteBtnInEdit = !!val;
            }
          }
        },
        {
          title: '删除按钮文案',
          type: 'text',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideDeleteBtnInEdit;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data?.deleteText;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.deleteText = val;
            }
          }
        },
        {
          title: '隐藏取消按钮',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.hideCancelBtn;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.hideCancelBtn = !!val;
            }
          }
        },
        {
          title: '取消按钮文案',
          type: 'text',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideCancelBtn;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data?.cancelText;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.cancelText = val;
            }
          }
        }
      ]
    },
    {
      title: '回调事件',
      items: [
        {
          title: '保存回调',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useSaveCallback;
            },
            set({ data, output }: EditorResult<Data>, val: boolean) {
              data.useSaveCallback = !!val;
              const hasEvent = output.get(OUTPUTS.SaveCallback);
              const schema = {
                type: 'object',
                properties: {
                  index: {
                    type: 'number',
                    title: '行索引'
                  },
                  ...getColumnsDataSchema(data.columns, data.rowKey)
                }
              };
              if (val && !hasEvent) {
                output.add(OUTPUTS.SaveCallback, '保存回调', schema);
              }
              if (!val && hasEvent) {
                output.remove(OUTPUTS.SaveCallback);
              }
            }
          }
        },
        {
          title: '保存回调事件',
          type: '_Event',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.useSaveCallback;
          },
          options: {
            outputId: OUTPUTS.SaveCallback
          }
        },
        {
          title: '删除回调',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useDelCallback;
            },
            set({ data, output }: EditorResult<Data>, val: boolean) {
              data.useDelCallback = !!val;
              const hasEvent = output.get(OUTPUTS.DelCallback);
              if (val && !hasEvent) {
                const schema = {
                  type: 'object',
                  properties: {
                    index: {
                      type: 'number',
                      title: '行索引'
                    },
                    ...getColumnsDataSchema(data.columns, data.rowKey)
                  }
                };
                output.add(OUTPUTS.DelCallback, '删除回调', schema);
              }
              if (!val && hasEvent) {
                output.remove(OUTPUTS.DelCallback);
              }
            }
          }
        },
        {
          title: '删除回调事件',
          type: '_Event',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.useDelCallback;
          },
          options: {
            outputId: OUTPUTS.DelCallback
          }
        }
      ]
    }
  ]
});

import { Data, INPUTS, OUTPUTS } from '../constants';
import { Schemas } from '../schema';

export default [
  {
    title: '操作配置',
    items: [
      {
        title: '动态配置操作',
        description: '开启后可以通过连线，修改操作配置',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useOperationDynamic;
          },
          set({ data, input, output }: EditorResult<Data>, val: boolean) {
            data.useOperationDynamic = !!val;
            if (val && !input.get(INPUTS.SetOpConfig)) {
              input.add(INPUTS.SetOpConfig, '修改操作配置', Schemas.SetOpConfig);
              output.add(OUTPUTS.SetOpConfigDone, '修改操作配置完成', Schemas.SetOpConfig);
            }
            if (!val && input.get(INPUTS.SetOpConfig)) {
              input.remove(INPUTS.SetOpConfig);
              output.remove(OUTPUTS.SetOpConfigDone);
            }
          }
        }
      },
      {
        title: '实时保存',
        description: '无需保存，修改后会立即同步数据',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useAutoSave;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.useAutoSave = !!val;
          }
        }
      },
      {
        title: '实时保存防抖',
        description: '实时保存操作的防抖时间，默认为0，表示不使用防抖',
        type: 'InputNumber',
        options: [{ title: '防抖时间', min: 0, max: 10000, width: 100 }],
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.useAutoSave;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.debounceAutoSaveTime];
          },
          set({ data }: EditorResult<Data>, val: number[]) {
            data.debounceAutoSaveTime = val[0];
          }
        }
      },
      {
        title: '点击切换编辑态',
        description: '点击单元格切换到编辑态',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.clickChangeToedit;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.clickChangeToedit = !!val;
          }
        }
      },
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
        title: '隐藏新增按钮',
        type: 'switch',
        description: '隐藏操作列的新增按钮',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.hideAddBtn;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.hideAddBtn = !!val;
          }
        }
      },
      {
        title: '单行编辑',
        type: 'switch',
        description: '开启后，可编辑表格只能同时编辑一行',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.editType === 'single';
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.editType = val ? 'single' : 'multiple';
          }
        }
      },
      {
        title: '单行编辑的提示文案',
        type: 'text',
        description: '配置单行编辑的toast提示文案，同新增一行提示',
        ifVisible({ data }: EditorResult<Data>) {
          return data.editType === 'single';
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.onlyOneAlertMessage;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.onlyOneAlertMessage = val;
          }
        }
      },
    ]
  },
  {
    title: '可展开行配置',
    items: [
      {
        title: '父节点行数据只读',
        description: '开启后，含children字段的数据行禁止编辑，不是设置所有的数据只读',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.readonlyWhenHasChildren;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.readonlyWhenHasChildren = !!val;
          }
        }
      }
    ]
  },
  {
    title: '勾选配置',
    items: [
      {
        title: '勾选',
        description: '开启后，数据支持勾选',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useRowSelection;
          },
          set({ data, input, output }: EditorResult<Data>, val: boolean) {
            data.useRowSelection = !!val;
            const hasInputEvent = input.get(INPUTS.GetRowSelect);
            const hasOutputEvent = input.get(OUTPUTS.GetRowSelect);
            if (val) {
              !hasInputEvent && input.add(INPUTS.GetRowSelect, '获取勾选数据', Schemas.Void);
              !hasOutputEvent &&
                output.add(OUTPUTS.GetRowSelect, '勾选数据输出', Schemas.GetRowSelect(data));
              input.get(OUTPUTS.GetRowSelect)?.setRels([OUTPUTS.GetRowSelect]);
            } else {
              hasInputEvent && input.remove(INPUTS.GetRowSelect);
              hasOutputEvent && output.remove(OUTPUTS.GetRowSelect);
            }
          }
        }
      },
      {
        title: '勾选标识',
        type: 'text',
        description: '勾选标识字段，默认为行唯一标识字段',
        options: {
          placeholder: '默认为行唯一标识字段'
        },
        ifVisible({ data }: EditorResult<Data>) {
          return data.useRowSelection;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.selectionRowKey;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.selectionRowKey = value;
          }
        }
      },
      {
        title: '动态设置勾选项',
        type: 'Switch',
        description: '开启后，可以通过输入项【设置勾选项】动态设置勾选项',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useRowSelection;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useSetSelectedRowKeys;
          },
          set({ data, input }: EditorResult<Data>, value: boolean) {
            data.useSetSelectedRowKeys = value;
            const hasEvent = input.get(INPUTS.SetRowSelect);
            if (value) {
              !hasEvent && input.add(INPUTS.SetRowSelect, '设置勾选项', Schemas.SetRowSelect);
            } else {
              hasEvent && input.remove(INPUTS.SetRowSelect);
            }
          }
        }
      }
    ]
  },
  {
    title: '事件',
    items: [
      {
        title: '数据变化事件',
        description: '开启数据变化事件',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useChangeEvent;
          },
          set({ data, output }: EditorResult<Data>, val: boolean) {
            const hasEvent = output.get(OUTPUTS.ChangeEvent);
            if (val) {
              !hasEvent && output.add(OUTPUTS.ChangeEvent, '数据变化', Schemas.ChangeEvent(data));
            } else {
              hasEvent && output.remove(OUTPUTS.ChangeEvent);
            }
            data.useChangeEvent = !!val;
          }
        }
      },

      {
        title: '数据变化事件',
        type: '_Event',
        ifVisible({ data, output }: EditorResult<Data>) {
          return !!(data.useChangeEvent && output.get(OUTPUTS.ChangeEvent));
        },
        options: {
          outputId: OUTPUTS.ChangeEvent
        }
      },
      {
        title: '状态切换事件',
        description: '开启状态切换事件,包括进入编辑,保存退出编辑,取消退出编辑',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data?.useStateSwitching;
          },
          set({ data, output }: EditorResult<Data>, val: boolean) {
            const hasEvent = output.get(OUTPUTS.StateSwitching);
            if (val) {
              !hasEvent &&
                output.add(OUTPUTS.StateSwitching, '状态切换', Schemas.StateSwitching(data));
            } else {
              hasEvent && output.remove(OUTPUTS.StateSwitching);
            }
            data.useStateSwitching = !!val;
          }
        }
      },
      {
        title: '状态切换事件',
        type: '_Event',
        description: '任一列的状态发生变化时触发，关联输出项【状态切换】',
        ifVisible({ data, output }: EditorResult<Data>) {
          return !!(data.useStateSwitching && output.get(OUTPUTS.StateSwitching));
        },
        options: {
          outputId: OUTPUTS.StateSwitching
        }
      }
    ]
  }
];

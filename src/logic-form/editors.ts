import { Data } from './constant';

export default {
  '@init'({ style }) {
    style.width = '100%';
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    {
      title: '条件数目为1时展示连接符',
      type: 'Switch',
      description: '关闭后, 当条件组的条件只有一条时，不展示连接符',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.showJoinerWhenOnlyOneCondition;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.showJoinerWhenOnlyOneCondition = value;
        }
      }
    },
    {
      title: '使用默认空白占位',
      type: 'Switch',
      description: '关闭后, 条件为空时，展示默认的占位符',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useDefaultEmpty;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.useDefaultEmpty = value;
        }
      }
    },
    {
      title: '最深层级限制',
      type: 'switch',
      description: '开启后, 有最深层级限制',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useDeepestLevel;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.useDeepestLevel = value;
        }
      }
    },
    {
      title: '最深层级',
      type: 'inputNumber',
      ifVisible({ data }) {
        return data.useDeepestLevel;
      },
      options: [{ min: 1, width: 100 }],
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.deepestLevel] || [5];
        },
        set({ data }: EditorResult<Data>, value: number[]) {
          data.deepestLevel = value[0];
        }
      }
    }
  ]
};

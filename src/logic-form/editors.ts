import { Data } from './constant';
import styles from './styles.less';

export default {
  '@init'({ style }) {
    style.width = '100%';
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items: ({}: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '逻辑表单';
      cate1.items = [
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
          title: '展示条件组序号',
          type: 'Switch',
          description: '开启后, 条件组会展示对应序号',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.showConditionOrder;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.showConditionOrder = value;
            }
          }
        },
        {
          title: '只展示最外层条件组序号',
          type: 'Switch',
          description: '开启后, 深层的条件组序号不展示',
          ifVisible({ data }) { // 编辑项显示的条件
            return data.showConditionOrder;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              // 是否只展示最外层条件组序号
              return data?.onlyShowOutermostLayerConditionOrder || false;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.onlyShowOutermostLayerConditionOrder = value;
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
      ];
    },
    style: [
      {
        title: '序号',
        ifVisible({ data }) { // 编辑项显示的条件
          return data.showConditionOrder;
        },
        options: [{ type: 'font', config: { disableTextAlign: true } }, { type: 'background', config: { disableBackgroundImage: true } }],
        target: `.${styles.order}`
      },
      {
        title: '连接符',
        options: [{ type: 'font', config: { disableTextAlign: true } }, { type: 'border' }],
        target: `.${styles.whereJoiner}`
      },
      {
        title: '连接符竖线',
        options: [{ type: 'background', config: { disableBackgroundImage: true } }],
        target: `.${styles.dividerLine}`
      }
    ]
  }
};

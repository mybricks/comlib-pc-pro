import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { Data } from '../constants';

export default {
  title: '样式配置',
  items: [
    {
      title: '布局风格',
      type: 'Select',
      options: [
        { value: 'default', label: '默认' },
        { value: 'middle', label: '适中布局' },
        { value: 'small', label: '紧凑布局' }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.size || 'middle';
        },
        set({ data }: EditorResult<Data>, value: SizeType) {
          data.size = value;
        }
      }
    }
  ]
};

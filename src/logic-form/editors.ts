import { Data } from './constant';

export default {
  ':root': [
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

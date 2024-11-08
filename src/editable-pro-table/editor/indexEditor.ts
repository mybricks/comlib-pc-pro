import { Data, TypeEnum } from '../constants';
import { checkType, getThIdx } from '../utils';

export default {
  title: '列位置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    return checkType(data, focusArea, [], [TypeEnum.Option]);
  },
  items: [
    {
      title: '前移',
      type: 'button',
      description: '向前移动本列',
      ifVisible({ focusArea }: EditorResult<Data>) {
        return focusArea?.index > 0;
      },
      value: {
        set({ data, focusArea }: EditorResult<Data>) {
          const idx = getThIdx(focusArea);
          const item = data.columns[idx];
          data.columns.splice(idx, 1);
          data.columns.splice(idx - 1, 0, item);

          data.columns = [...data.columns];
        }
      }
    },
    {
      title: '后移',
      type: 'button',
      description: '向后移动本列',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const idx = getThIdx(focusArea);
        return idx < data.columns.length - 2;
      },
      value: {
        set({ data, focusArea }: EditorResult<Data>) {
          const idx = getThIdx(focusArea);
          const item = data.columns[idx];
          data.columns.splice(idx, 1);
          data.columns.splice(idx + 1, 0, item);

          data.columns = [...data.columns];
        }
      }
    },
    {
      title: '删除列',
      type: 'button',
      description: '删除本列',
      value: {
        set({ data, focusArea, slot }: EditorResult<Data>) {
          const idx = getThIdx(focusArea);
          data.columns[idx].slotId && slot.remove(data.columns[idx].slotId);
          data.columns[idx].slotEditId && slot.remove(data.columns[idx].slotEditId);
          data.columns.splice(idx, 1);

          data.columns = [...data.columns];
        }
      }
    }
  ]
};

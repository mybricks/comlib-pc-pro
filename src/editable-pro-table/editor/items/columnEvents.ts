import { Data, OUTPUTS } from '../../constants';
import { Schemas, setDataSchema } from '../../schema';
import { getCol, setCol } from '../../utils';

export default   {
  title: '事件',
  items: [
    {
      title: '数据变化事件',
      description: '开启数据变化事件',
      type: 'switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'useColumnChangeEvent');
        },
        set({ data, focusArea, output, input, slot }: EditorResult<Data>, val: boolean) {
          const hasEvent = output.get(OUTPUTS.ColumnChangeEvent);
          if (val) {
            !hasEvent && output.add(OUTPUTS.ColumnChangeEvent, '值变化', Schemas.ColumnChangeEvent());
          } else {
            hasEvent && output.remove(OUTPUTS.ColumnChangeEvent);
          }
          setCol(data, focusArea, 'useColumnChangeEvent', !!val);
          setDataSchema({ data, output, input, slot });
        }
      }
    },
    {
      title: '数据变化事件',
      type: '_Event',
      ifVisible({ data, focusArea, output }: EditorResult<Data>) {
        return getCol(data, focusArea, 'useColumnChangeEvent');
      },
      options: {
        outputId: OUTPUTS.ColumnChangeEvent
      }
    },
  ]
}
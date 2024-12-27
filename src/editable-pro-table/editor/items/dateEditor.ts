import { Data, TypeEnum } from '../../constants';
import { checkType, getCol, setCol } from '../../utils';

export default {
  title: '日期配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    return checkType(data, focusArea, [TypeEnum.Date, TypeEnum.DateRange]);
  },
  items: [
    {
      title: '日期选择类型',
      type: 'Select',
      description: '设置日期选择类型，可选的日期类型',
      options: [
        { label: '日期', value: 'date' },
        { label: '周', value: 'week' },
        { label: '月份', value: 'month' },
        { label: '季度', value: 'quarter' },
        { label: '年份', value: 'year' }
      ],
      value: {
        get({ data, focusArea }) {
          let datePicker = getCol(data, focusArea, 'datePicker');

          if (!datePicker) {
            // 默认值
            setCol(data, focusArea, 'datePicker', 'date');
            datePicker = 'date';
          }

          return datePicker;
        },
        set({ data, focusArea }, val) {
          setCol(data, focusArea, 'datePicker', val);
        }
      }
    },
    {
      title: '日期展示格式',
      type: 'Select',
      options: [
        { label: '年-月-日 时:分:秒', value: 'Y-MM-DD HH:mm:ss' },
        { label: '年-月-日 时:分', value: 'Y-MM-DD HH:mm' },
        { label: '年-月-日 时', value: 'Y-MM-DD HH' },
        { label: '年-月-日', value: 'Y-MM-DD' },
        { label: '年-月', value: 'Y-MM' },
        { label: '年', value: 'Y' },
        { label: '时间戳', value: 'timeStamp' },
        { label: '自定义', value: 'custom' }
      ],
      value: {
        get({ data, focusArea }) {
          let dateShowType = getCol(data, focusArea, 'dateShowType');

          if (!dateShowType) {
            // 默认值
            setCol(data, focusArea, 'dateShowType', 'Y-MM-DD');
            dateShowType = 'Y-MM-DD';
            setCol(data, focusArea, 'dateCustomShowFormatter', dateShowType);
          }

          return dateShowType;
        },
        set({ data, focusArea }, val) {
          if (val !== "custom") {
            setCol(data, focusArea, 'dateCustomShowFormatter', val);
          }
          setCol(data, focusArea, 'dateShowType', val);
        }
      }
    },
    {
      title: '自定义展示格式化模板',
      type: 'text',
      description:
        '日期格式化模板 YYYY:年份 MM:月份 DD:日 dd:星期 HH:24小时制 hh:12小时制 mm:分 ss:秒',
      ifVisible({ data, focusArea }) {
        return getCol(data, focusArea, 'dateShowType') === 'custom';
      },
      value: {
        get({ data, focusArea }) {
          return getCol(data, focusArea, 'dateCustomShowFormatter');
        },
        set({ data, focusArea }, value: string) {
          setCol(data, focusArea, 'dateCustomShowFormatter', value);
        }
      }
    },
    {
      title: '选择时间',
      type: 'Switch',
      description: '开启后支持选择时间',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getCol(data, focusArea, 'showTime');
        },
        set({ data, focusArea }, val: boolean) {
          setCol(data, focusArea, 'showTime', val);
        }
      }
    },
    {
      title: '输出日期格式化模板',
      type: 'Select',
      description: '将输出(值变化事件和表单提交)的数据设置成所需要的格式',
      options: [
        { label: '年-月-日 时:分:秒', value: 'Y-MM-DD HH:mm:ss' },
        { label: '年-月-日 时:分', value: 'Y-MM-DD HH:mm' },
        { label: '年-月-日 时', value: 'Y-MM-DD HH' },
        { label: '年-月-日', value: 'Y-MM-DD' },
        { label: '年-月', value: 'Y-MM' },
        { label: '年', value: 'Y' },
        { label: '时间戳', value: 'timeStamp' },
        { label: '自定义', value: 'custom' }
      ],
      value: {
        get({ data, focusArea }) {
          let dateOutputType = getCol(data, focusArea, 'dateOutputType');

          if (!dateOutputType) {
            // 默认值
            setCol(data, focusArea, 'dateOutputType', 'Y-MM-DD');
            dateOutputType = 'Y-MM-DD';
            setCol(data, focusArea, 'dateCustomFormatter', dateOutputType);
          }

          return dateOutputType;
        },
        set({ data, focusArea }, val) {
          if (val !== "custom") {
            setCol(data, focusArea, 'dateCustomFormatter', val);
          }
          setCol(data, focusArea, 'dateOutputType', val);
        }
      }
    },
    {
      title: '自定义格式化模板',
      type: 'text',
      description:
        '日期格式化模板 YYYY:年份 MM:月份 DD:日 dd:星期 HH:24小时制 hh:12小时制 mm:分 ss:秒',
      ifVisible({ data, focusArea }) {
        return getCol(data, focusArea, 'dateOutputType') === 'custom';
      },
      value: {
        get({ data, focusArea }) {
          return getCol(data, focusArea, 'dateCustomFormatter');
        },
        set({ data, focusArea }, value: string) {
          setCol(data, focusArea, 'dateCustomFormatter', value);
        }
      }
    },
  ]
};

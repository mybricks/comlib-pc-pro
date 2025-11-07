import { ProColumns } from '@ant-design/pro-table';
import { ButtonType } from 'antd/lib/button';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { Data as PaginationData } from './components/Paginator/constants';
import { defaultValidatorExample } from './utils';

export const INPUTS = {
  SetDataSource: 'value',
  Submit: 'submit',
  SetColConfig: 'colsCfg',
  SetColValue: 'colValue',
  SetOpConfig: 'operationConfig',

  AddRow: 'addRow',
  DelRow: 'delRow',
  MoveDown: 'moveDown',
  MoveUp: 'moveUp',

  GetRowSelect: 'rowSelect',
  SetRowSelect: 'setRowSelect',

  SlotRowValue: 'slotRowValue',
  SlotColValue: 'slotColValue',
  RowIndex: 'rowIndex',

  DynamicColumns: 'dynamicColumns',

  CancelRow: 'cancelRow',

  EditableRows: 'editableRows',

  GetValue: 'getValue',

  SubmitWithCheck: 'submitWithCheck'
};

export const OUTPUTS = {
  Submit: 'submit',
  GetRowSelect: 'rowSelect',

  SaveCallback: 'saveCallback',
  DelCallback: 'delCallback',

  ChangeEvent: 'changeEvent',

  ColumnChangeEvent: 'columnChangeEvent',

  EditTableData: 'editTableData',

  StateSwitching: 'stateSwitching',

  SetDataSourceDone: 'value',
  SetColConfigDone: 'colsCfg',
  SetColValueDone: 'colValue',
  AddRowDone: 'addRow',

  SetOpConfigDone: 'operationConfig',

  CancelRowDone: 'cancelRow',

  EditableRowsDone: 'editableRows',

  GetValue: 'getValue',

  SubmitWithCheckSuccess: 'submitWithCheckSuccess',
  SubmitWithCheckError: 'submitWithCheckError'
};

export enum TypeEnum {
  Text = 'text',
  Number = 'digit',
  Select = 'select',
  Switch = 'switch',
  Date = 'date',
  DateRange = 'dateRange',
  Option = 'option',
  Slot = 'slot',
  TreeSelect = 'treeSelect',
  Checkbox = 'checkbox',
  Cascader = 'cascader'
}

export const TypeEnumMap = {
  [TypeEnum.Text]: '输入框',
  [TypeEnum.Number]: '数字输入框',
  [TypeEnum.Select]: '下拉框',
  [TypeEnum.TreeSelect]: '树选择',
  [TypeEnum.Switch]: '开关',
  [TypeEnum.Date]: '日期',
  [TypeEnum.Slot]: '自定义插槽',
  [TypeEnum.DateRange]: '日期范围选择',
  [TypeEnum.Checkbox]: '多选框',
  [TypeEnum.Cascader]: '级联选择'
};

export const ColumnsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: {
        type: 'string'
      },
      dataIndex: {
        type: 'string'
      },
      valueType: {
        type: 'enum',
        items: [
          {
            type: 'string',
            value: 'text'
          },
          {
            type: 'string',
            value: 'digit'
          },
          {
            type: 'string',
            value: 'select'
          },
          {
            type: 'string',
            value: 'treeSelect'
          },
          {
            type: 'string',
            value: 'cascader'
          },
          {
            type: 'string',
            value: 'switch'
          },
          {
            type: 'string',
            value: 'checkbox'
          },
          {
            type: 'string',
            value: 'date'
          },
          {
            type: 'string',
            value: 'dateRange'
          }
        ]
      },
      width: {
        type: 'number'
      },
      align: {
        type: 'enum',
        items: [
          {
            type: 'string',
            value: 'left'
          },
          {
            type: 'string',
            value: 'center'
          },
          {
            type: 'string',
            value: 'right'
          }
        ]
      },
      required: {
        type: 'string'
      },
      readonly: {
        type: 'boolean'
      },
      disableScript: {
        type: 'string'
      },
      ellipsis: {
        type: 'boolean'
      },
      useTooltip: {
        type: 'boolean'
      },
      tooltip: {
        type: 'string'
      }
      // valueEnum: {
      //   type: 'array',
      //   items: {
      //     type: 'object',
      //     properties: {
      //       label: {
      //         type: 'string'
      //       },
      //       value: {
      //         type: 'string'
      //       },
      //     }
      //   },
      // },
      // fieldProps: {
      //   type: 'object',
      // },
    }
  }
};

export const ROW_KEY = '_key';

export enum RuleKeys {
  REQUIRED = 'required',
  REPEAT = 'repeat',
  CODE = 'code',
  CUSTOM_EVENT = 'customEvent'
}

export type VerificationRuleType = {
  key: RuleKeys; // 唯一标识
  title: string; // 名字 '自定义校验'
  message: string; // 校验后提示
  status?: boolean; // 是否启用
  visible?: boolean; // 是否显示
  [k: string]: any; // 其他需要加的特殊字段
};

export const baseVerificationRules: Array<VerificationRuleType> = [
  {
    key: RuleKeys.REQUIRED,
    title: '必填',
    message: '此项是必填项',
    status: false
  },
  {
    key: RuleKeys.REPEAT,
    title: '值不重复',
    message: '该字段值不能重复',
    status: false
  },
  {
    key: RuleKeys.CODE,
    title: '代码校验',
    message: '代码校验失败',
    code: defaultValidatorExample,
    status: false
  }
];

export type ColumnItem = ProColumns<any> & {
  readonly?: boolean;
  disableScript?: string;
  showAddChildBtn?: boolean;
  required?: boolean;
  VerificationRules?: VerificationRuleType[];
  openText?: string;
  closeText?: string;
  defaultChecked?: boolean;
  useTooltip?: boolean;
  showTime?: boolean;
  slotId?: string;
  slotEditId?: string;

  multiple?: boolean;
  showSearch?: boolean;

  _key?: string;

  dataSchema?: any;
  // 省略展示
  ellipsis?: any;

  optionFilterProp?: string; // 搜索规则 默认 value

  errorType?: 'popover' | 'default'; // 校验失败提示类型

  isRowKey?: boolean;
  visible?: boolean;

  dateOutputType?: string;
  dateCustomFormatter?: string;
  dateShowType?: string;
  dateCustomShowFormatter?: string;
};
export interface Data {
  headerTitle: string;
  columns: ColumnItem[];
  size?: SizeType;
  hasLoading: boolean;
  creatorButtonText: string;

  hideAllOperation?: boolean;
  hideAddBtn?: boolean;
  hideModifyBtn?: boolean;
  hideDeleteBtn?: boolean;
  hideAllAddChildBtn?: boolean;
  addChildBtnLabel?: string;
  addChildBtnScript?: string;

  hideSaveBtn?: boolean;
  hideDeleteBtnInEdit?: boolean;
  hideCancelBtn?: boolean;
  hideNewBtn?: boolean;

  useAutoSave?: boolean;
  /**@description 实时保存防抖时间 1.0.24 */
  debounceAutoSaveTime?: number;
  useOperationDynamic?: boolean;
  readonlyWhenHasChildren?: boolean;

  useRowSelection?: boolean;
  useDelDataSource?: boolean;
  useMoveDataSource?: boolean;

  useSetSelectedRowKeys?: boolean;
  selectionRowKey?: string;

  submitIOs?: any[];

  useSaveCallback?: boolean;
  useDelCallback?: boolean;

  useChangeEvent?: boolean;

  useColumnChangeEvent?: boolean;

  clickChangeToedit?: boolean;

  fixedHeader: boolean; // 固定表头
  scroll: Scroll; // 滚动
  fixedHeight?: boolean | undefined;

  editType: 'single' | 'multiple'; // 可编辑表格的类型，单行编辑或者多行编辑
  onlyOneAlertMessage: string, //只能新增一行的提示文案

  saveText: string; // 保存按钮文案
  deleteText: string; // 删除按钮文案
  cancelText: string; // 取消按钮文案
  editText: string; // 编辑按钮文案

  // 空数据配置
  isEmpty: boolean;
  image: string;
  description: string;

  bordered: boolean; // 边框

  // 是否支持动态表头
  dynamicColumns: boolean;

  actions: Action[];
  rowKey: string;

  // 动态显隐操作按钮
  dynamicDisplayModifyBtnScript?: string;
  dynamicDisplayDeleteBtnScript?: string;

  // 二次确认框
  deleteSecondConfirm?: boolean;
  deleteSecondConfirmText?: string;
  saveSecondConfirm?: boolean;
  saveSecondConfirmText?: string;

  useStateSwitching?: boolean; // 状态切换事件

  usePagination?: boolean;
  paginationConfig: PaginationData;

  hasUpdateRowKey?: number;

  ellipsis?: boolean;
}

export const OutputIds = {
  PageChange: 'pageChange',
  GetPageInfo: 'getPageInfo',
  SetPageNumFinish: 'setPageNumFinish',
  // 新增对应串行输出
  SetTotal: 'setTotal',
  SetDisable: 'setDisable',
  SetEnable: 'setEnable'
};
export const InputIds = {
  SetEnable: 'setEnable',
  SetDisable: 'setDisable',

  SetTotal: 'setTotal',
  SetPageNum: 'setPageNum',

  GetPageInfo: 'getPageInfo'
};

/**@description 组件尺寸分类 */
export enum SizeEnum {
  'Small' = 'small',
  'Middle' = 'middle',
  'Large' = 'large'
}

export type IconSrcType = false | 'custom' | 'inner';

/** @description 按钮图标位置 */
export enum LocationEnum {
  FRONT = 'front',
  BACK = 'back'
}

export interface Action {
  title: string;
  loading?: boolean;
  isDefault: boolean;
  outputId: string;
  type?: ButtonType;
  key: string;
  visible?: boolean;
  danger?: boolean;
  size: SizeEnum;
  /** @description 动态显示表达式 */
  displayExpression?: string;
  /** @description 图标配置 */
  iconConfig: {
    // 图标来源
    src: IconSrcType;
    // 图标尺寸
    size: [number, number];
    // 图标与文字的间隔
    gutter: number;
    // 内置图标
    innerIcon?: string;
    // 自定义图标
    customIcon?: string;
    // 图标位置
    location: LocationEnum;
  };
  /** @description 权限配置 */
  permission?: {
    id: string;
    type?: string;
  };
}

/**@description 组件尺寸的选项 */
export const SizeOptions = [
  {
    label: '小',
    value: SizeEnum.Small
  },
  {
    label: '默认',
    value: SizeEnum.Middle
  },
  {
    label: '大',
    value: SizeEnum.Large
  }
];

interface Scroll {
  y: number | string | undefined;
}

export type DataSourceType = {
  // _key: React.Key;
  _add?: boolean;
  [key: string]: any;
};

export const defaultData: DataSourceType[] = [
  {
    _key: 624748504,
    title: '活动名称一',
    desc: '这个活动真好玩',
    state: 'open',
    createdAt: '2020-05-26T09:42:56Z',
    update_at: '2020-05-26T09:42:56Z'
  }
];

export const getDefaultColumns: () => ProColumns<any>[] = () => [
  {
    title: '活动名称',
    dataIndex: 'title',
    valueType: 'text',
    align: 'left',
    width: 200,
    fixed: undefined,
    key: 'title',
    fieldProps: {},
    VerificationRules: baseVerificationRules,
    visible: true
  },
  {
    title: '描述',
    dataIndex: 'desc',
    valueType: 'text',
    align: 'left',
    width: 200,
    fixed: undefined,
    key: 'desc',
    fieldProps: {},
    VerificationRules: baseVerificationRules,
    visible: true
  },
  {
    title: '活动时间',
    dataIndex: 'createdAt',
    valueType: 'date',
    align: 'left',
    width: 200,
    fixed: undefined,
    key: 'createdAt',
    fieldProps: {},
    VerificationRules: baseVerificationRules,
    visible: true
  },
  {
    title: '操作',
    valueType: 'option',
    align: 'left',
    fixed: undefined,
    width: 200,
    fieldProps: {},
    visible: true
  }
];

export const getColumnItem = (
  data: Data,
  focusArea: { dataset: { [x: string]: any } },
  datasetKey = 'tableThIdx'
): ColumnItem => {
  const key = focusArea.dataset[datasetKey];
  return data.columns[key] || {};
};

export const ColorMap = {
  number: {
    color: '#4460B8',
    text: '数字'
  },
  boolean: {
    color: '#ff0000',
    text: '布尔'
  },
  string: {
    color: '#88a409',
    text: '字符'
  },
  object: {
    color: '#9727d0',
    text: '对象'
  },
  array: {
    color: '#ce980f',
    text: '数组'
  }
};

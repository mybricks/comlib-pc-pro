import { Data, INPUTS, OUTPUTS, baseVerificationRules } from './constants';
import { AlignTypeEnum, SizeTypeEnum } from './components/Paginator/constants';
import { setDataSchema } from './schema';
import { isNullValue } from './utils';

export default function ({ data, input, output, slot }: UpgradeParams<Data>): boolean {
  //1.0.13 -> 1.0.14
  let key: Array<any> = [];
  key = data.columns.map((item) => {
    return item.dataIndex;
  });
  let newkey: Array<any> = [];
  newkey = key.filter((item) => {
    return item !== undefined;
  });
  let childSchema = {};
  for (let i = 0; i < newkey.length; i++) {
    childSchema[newkey[i]] = { type: 'string' };
  }

  // 表头滚动
  if (data.fixedHeader === undefined) {
    data.fixedHeader = false;
  }
  if (data.scroll === undefined) {
    data.scroll = {
      y: ''
    };
  }

  if (!data.editType) {
    data.editType = 'multiple';
  }

  if (!data?.saveText) {
    data.saveText = '保存';
  }

  if (!data?.deleteText) {
    data.deleteText = '删除';
  }

  if (!data?.cancelText) {
    data.cancelText = '取消';
  }

  if (!data?.editText) {
    data.editText = '编辑';
  }

  /**
   * @description v1.0.14->1.0.15 自定义空白文案和图片
   */
  if (data?.description === undefined) {
    data.description = '暂无数据';
  }
  if (data?.image === undefined) {
    data.image =
      'data:image/png;base64,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';
  }
  if (data?.isEmpty === undefined) {
    data.isEmpty = false;
  }

  if (data?.bordered === undefined) {
    data.bordered = false;
  }

  if (data.fixedHeight === undefined) {
    data.fixedHeight = false;
  }

  if (data.actions === undefined) {
    data.actions = [];
  }

  if (data.selectionRowKey) {
    data.rowKey = data.selectionRowKey;
  }

  if (typeof data?.deleteSecondConfirmText === 'undefined') {
    data.deleteSecondConfirmText = '确定要删除这条数据吗？';
  }
  if (typeof data?.saveSecondConfirmText === 'undefined') {
    data.saveSecondConfirmText = '确定要保存吗？';
  }
  if (typeof data?.useStateSwitching === 'undefined') {
    data.useStateSwitching = false;
  }

  if (typeof data?.usePagination === 'undefined') {
    data.usePagination = false;
  }

  if (typeof data?.paginationConfig === 'undefined') {
    data.paginationConfig = {
      total: 20,
      text: '共 {total} 条结果',
      current: 1,
      useFrontPage: false,
      currentPage: {
        pageNum: 1,
        pageSize: 10
      },
      isDynamic: false,
      disabled: false,
      defaultPageSize: 10,
      align: AlignTypeEnum.FlexEnd,
      size: SizeTypeEnum.Default,
      showSizeChanger: false,
      pageSizeOptions: ['10', '20', '50', '100'],
      showQuickJumper: false,
      hideOnSinglePage: false
    };
  }

  // 列配置修改
  data.columns &&
    data.columns.forEach((column, index) => {
      if (isNullValue(column.VerificationRules)) {
        const temp = JSON.parse(JSON.stringify(baseVerificationRules));
        temp[0].status = !!column.required;
        data.columns[index].VerificationRules = temp;
      }

      let visible = column?.visible;
      if (column?.valueType === 'option') {
        visible = !data.hideAllOperation;
      } else if (isNullValue(visible)) {
        visible = true;
      }

      let isRowKey = column?.isRowKey;
      if (column.dataIndex === data?.rowKey && data?.rowKey) {
        isRowKey = true;
      }
      data.columns[index] = {
        ...data.columns[index],
        isRowKey,
        visible
      };
    });

  const addOutputAndRel = (
    outputKey: string,
    title: string,
    inputKey: string,
    schema?: Record<string, any>
  ) => {
    if (!output.get(outputKey)) {
      const Input = input.get(inputKey);
      output.add(outputKey, title, schema || Input?.schema || { type: 'any' });
      if (Input) {
        Input?.setRels([outputKey]);
      }
    }
  };

  addOutputAndRel(OUTPUTS.SetDataSourceDone, '数据', INPUTS.SetDataSource);
  addOutputAndRel(OUTPUTS.AddRowDone, '新增一行完成', INPUTS.AddRow);
  addOutputAndRel(OUTPUTS.SetColConfigDone, '设置列配置完成', INPUTS.SetColConfig);

  if (isNullValue(data?.hasUpdateRowKey)) {
    data.hasUpdateRowKey = 0;
  }

  if (!input.get(INPUTS.CancelRow)) {
    input.add(INPUTS.CancelRow, '取消当前编辑行', { type: 'any' }, '取消当前编辑行');
    const getTagsInput = input.get(INPUTS.CancelRow);
    getTagsInput.setRels([OUTPUTS.CancelRowDone]);
    addOutputAndRel(OUTPUTS.CancelRowDone, '取消当前编辑行完成', INPUTS.CancelRow);
  }

  if (!input.get(INPUTS.SetColValue)) {
    input.add(INPUTS.SetColValue, '修改列值', { 
      "type": "object",
      "properties": {
        "dataIndex": {
          "type": "string",
          "desc": "目标列的字段"
        },
        "value": {
          "type": "any",
          "desc": "值"
        },
        "rowKey": {
          "type": "string",
          "desc": "当前行的key"
        }
      } 
    }, '修改列值');
    const setColValueInput = input.get(INPUTS.SetColValue);
    setColValueInput.setRels([OUTPUTS.SetColValueDone]);
    addOutputAndRel(OUTPUTS.SetColValueDone, '设置列值完成', INPUTS.SetColValue);
  }

  setDataSchema({ data, output, input, slot });

  return true;
}

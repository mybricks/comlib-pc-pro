import { ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import { uuid, getTemplateRenderScript, runScript } from '../utils';
import { ColumnItem, Data, DataSourceType, ROW_KEY, TypeEnum } from './constants';
import { runJs } from '../../package/com-utils';

export * from '../utils';

export const getThIdx = (focusArea) => {
  return focusArea?.dataset?.tableThIdx;
};
export function setCol(data: Data, focusArea: any, key: string, value: any) {
  const idx = getThIdx(focusArea);
  const item = data.columns[idx];
  item[key] = value;
  data.columns[idx] = { ...item };

  data.columns = [...data.columns];
}
export function getCol(data: Data, focusArea, key) {
  const idx = getThIdx(focusArea);
  const item = data.columns[idx];
  return item[key];
}
export function checkType(data: Data, focusArea, includes?: any[], excludes?: any[]) {
  const idx = getThIdx(focusArea);
  let isAllow = true;
  const item = data.columns[idx];
  if (includes && includes.length) {
    isAllow = isAllow && includes.includes(item?.valueType);
  }
  if (excludes && excludes.length) {
    isAllow = isAllow && !excludes.includes(item?.valueType);
  }
  return isAllow;
}

// 根据key删除数据
export const deleteItemByKey = (
  ds: DataSourceType[],
  _key: React.Key | undefined,
  rowKey: string = ROW_KEY
): DataSourceType[] => {
  return ds
    .map((item) => {
      if (item && item[rowKey] !== _key) {
        if (item.children) {
          const newChildren = deleteItemByKey(item.children, _key);
          return {
            ...item,
            children: newChildren.length > 0 ? newChildren : undefined
          };
        }
        return item;
      }
      return null;
    })
    .filter(Boolean) as DataSourceType[];
};
// 根据key添加子项
export const addChildByKey = (
  ds: DataSourceType[],
  _key: React.Key | undefined,
  rowKey: string = ROW_KEY
): DataSourceType[] => {
  return ds
    .map((item) => {
      if (item && item[rowKey] !== _key) {
        if (item.children) {
          const newChildren = addChildByKey(item.children, _key);
          return {
            ...item,
            children: newChildren
          };
        }
        return item;
      } else {
        if (!Array.isArray(item.children)) {
          item.children = [];
        }
        item.children.push({ _key: uuid(), [rowKey]: uuid(), _add: true });
        return item;
      }
    })
    .filter(Boolean) as DataSourceType[];
};

//输出数据变形函数
const transCalculation = (val, type: string, formatter: string) => {
  let transValue = val || '';
  if (val) {
    switch (type) {
      //1. 年-月-日 时:分:秒
      case 'Y-MM-DD HH:mm:ss':
        transValue = moment(val).format('YYYY-MM-DD HH:mm:ss');
        break;
      //2. 年-月-日 时:分
      case 'Y-MM-DD HH:mm':
        transValue = moment(val).format('Y-MM-DD HH:mm');
        break;
      //3. 年-月-日
      case 'Y-MM-DD':
        transValue = moment(val).format('Y-MM-DD');
        break;
      //4. 年-月
      case 'Y-MM':
        transValue = moment(val).format('Y-MM');
        break;
      //5. 年
      case 'Y':
        transValue = moment(val).format('Y');
        break;
      //6. 时间戳
      case 'timeStamp':
        transValue = Number(val);
        break;
      //7. 自定义
      case 'custom':
        if (formatter) {
          let customDate = moment(val).format(formatter);
          if (customDate.indexOf('Su')) {
            customDate = customDate.replace('Su', '天');
          }
          if (customDate.indexOf('Mo')) {
            customDate = customDate.replace('Mo', '一');
          }
          if (customDate.indexOf('Tu')) {
            customDate = customDate.replace('Tu', '二');
          }
          if (customDate.indexOf('We')) {
            customDate = customDate.replace('We', '三');
          }
          if (customDate.indexOf('Th')) {
            customDate = customDate.replace('Th', '四');
          }
          if (customDate.indexOf('Fr')) {
            customDate = customDate.replace('Fr', '五');
          }
          if (customDate.indexOf('Sa')) {
            customDate = customDate.replace('Sa', '六');
          }
          transValue = customDate;
        }
        break;
      default:
        transValue = moment(val).format(type);
    }
  }
  return transValue;
};
// 格式化数据
export const formatDataSource = (
  ds: DataSourceType[],
  columns: ColumnItem[],
  rowKey: string = ROW_KEY
) => {
  const dateDataIndex = columns
    .filter((item) => item.valueType === TypeEnum.Date || item.valueType === TypeEnum.DateRange)
    .map((item) => ({
      key: item.dataIndex as string,
      format: item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
      type: item?.dateOutputType || (item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'),
      formatter: item?.dateCustomFormatter || 'Y-MM-DD'
    }));
  if (Array.isArray(ds)) {
    ds.forEach((item) => {
      if (item[rowKey] === undefined) {
        item[rowKey] = uuid();
      }
      dateDataIndex.forEach(({ key, format, type, formatter }) => {
        if (item[key]) {
          item[key] = Array.isArray(item[key])
            ? item[key].map((str) => transCalculation(moment(str, format), type, formatter))
            : transCalculation(moment(item[key], format), type, formatter);
        }
      });
      if (item.children) {
        formatDataSource(item.children, columns, rowKey);
      }
    });
  }
  return ds;
};
// 获取数据下的所有key
export const getAllDsKey = (ds: DataSourceType[], rowKey: string = ROW_KEY): string[] => {
  const keys: Array<any> = [];
  if (Array.isArray(ds)) {
    ds.forEach((item) => {
      if (item && item[rowKey] !== undefined) {
        keys.push(item[rowKey]);
      }
      if (item.children) {
        keys.push(...getAllDsKey(item.children, rowKey));
      }
    });
  }
  return keys;
};
// 格式化提交输出的数据
export const formatSubmitDataSource = (ds: DataSourceType[]) => {
  if (!Array.isArray(ds)) {
    return ds;
  }
  return ds.map((item) => {
    const { _add, children, ...res } = item;
    if (children) {
      return { ...res, children: formatSubmitDataSource(children) };
    }
    return { ...res };
  });
};

const getColumnConfig = (
  colsCfg: { [x: string]: any },
  item: ProColumns<any, any>
): ProColumns<any> => {
  const colCfg = (colsCfg ? colsCfg[item.key as React.Key] : {}) || {};
  (item.fieldProps as any) = { ...item.fieldProps, ...colCfg };
  if (item.valueType === TypeEnum.TreeSelect && colCfg.options) {
    (item.fieldProps as any).treeData = colCfg.options;
  }
  return item;
};
// 格式化Column
export const formatColumn = (
  data: Data,
  env: Env,
  colsCfg: any,
  validateValueExisting: (value: any, dataIndex: any) => Promise<void>
): any[] => {
  return data.columns
    .map((colItem, idx) => {
      const {
        valueEnum,
        required,
        showAddChildBtn,
        closeText,
        openText,
        defaultChecked,
        readonly,
        tooltip,
        useTooltip,
        errorType,
        VerificationRules,
        ...item
      } = colItem;
      if (env.runtime) {
        // Todo hack 方法
        item.key = item.dataIndex as React.Key;
      }
      // 开启 可展开行只读
      if (data.readonlyWhenHasChildren) {
        item.editable = (_: any, record: DataSourceType) =>
          Array.isArray(record?.children) ? false : true;
      }
      // TODO 通过数据内容表示 只读/编辑/删除 状态
      // item.editable = (_: any, record: DataSourceType) =>
      //   record?._readonly === true ? false : true;
      if (readonly) {
        //新增项 不支持只读
        item.editable = (_: any, record: DataSourceType) => (record?._add ? true : false);
      }
      item.fieldProps = {
        ...item.fieldProps
      };
      item.formItemProps = {
        ...item.formItemProps
      };

      if (!!errorType) {
        // @ts-ignore 库ts有问题
        item.formItemProps.errorType = errorType;
      }

      // 对校验做处理
      if (VerificationRules && VerificationRules?.length > 0) {
        VerificationRules.forEach((rules) => {
          const temp: Record<string, any> = {};
          // 对不同校验设置 formItemProps.rules
          switch (rules.key) {
            case 'required':
              if (rules.status) {
                temp.required = rules.status;
                temp.message = rules.message;
              }
              break;
            case 'repeat':
              if (rules.status) {
                temp.message = rules.message;
                temp.validator = (rule: any, value: any) =>
                  validateValueExisting(value, item.dataIndex);
              }
              break;

            // 代码校验
            case 'code':
              if (rules.status) {
                temp.validator = (rule: any, value: any) => {
                  return new Promise((resolve, reject) => {
                    runJs(rules.code, [value, { success: resolve, error: reject }]);
                  });
                };
              }
              break;

            default:
              break;
          }

          // @ts-ignore
          if (item?.formItemProps && !item?.formItemProps?.rules) {
            // @ts-ignore
            item.formItemProps.rules = [];
          }
          // @ts-ignore
          if (Object.keys(temp).length !== 0) {
            // @ts-ignore
            item.formItemProps.rules.push(temp);
          }
        });
      } else {
        // 没有升级的兼容
        if (required) {
          item.formItemProps.rules = [
            {
              required: true,
              message: '此项是必填项'
            }
          ];
        }
      }

      if (useTooltip && tooltip) {
        (item as any).tooltip = tooltip;
      }

      switch (item.valueType) {
        case TypeEnum.Date:
          (item.fieldProps as any).showTime = item.showTime;
          break;
        case TypeEnum.Option:
          if (data.hideAllOperation) {
            return null;
          }
          // Todo hack 方法
          if (env.edit) {
            item.key = [
              !data.hideModifyBtn && 'editable',
              !data.hideDeleteBtn && 'delete',
              !data.hideNewBtn && 'add'
            ]
              .filter((item) => item)
              .join();
          }
          break;
        case TypeEnum.Checkbox:
        case TypeEnum.Select:
          if (valueEnum) {
            (item.fieldProps as any).options = valueEnum;
          }
          break;
        case TypeEnum.Switch:
          if (item.formItemProps.initialValue === undefined) {
            item.formItemProps.initialValue = defaultChecked || false;
          }
          if ((item.fieldProps as any).defaultChecked !== undefined) {
            (item.fieldProps as any).defaultChecked = defaultChecked;
          }
          (item.fieldProps as any).checkedChildren = openText === undefined ? '打开' : openText;
          (item.fieldProps as any).unCheckedChildren = closeText === undefined ? '关闭' : closeText;
          break;
        default:
          break;
      }
      item.onHeaderCell = (): any => {
        return {
          'data-table-th-idx': idx
        };
      };
      item.onCell = (): any => {
        return {
          'data-table-column-id': idx
        };
      };
      return getColumnConfig(colsCfg, item);
    })
    .filter((item) => !!item);
};
// 根据data生成提示项
export const getSuggestions = (data: Data) => {
  const res: Array<{ label: any; insertText: string; detail: string }> = [];
  data.columns.forEach((col) => {
    if (col.valueType !== TypeEnum.Option && !res.find((item) => col.dataIndex === item.label)) {
      res.push({
        label: col.dataIndex,
        insertText: `{${col.dataIndex}}` + ' === ',
        detail: `当前行${col.dataIndex}值`
      });
    }
  });
  return res;
};
export const run = (script: string) => {
  return runScript(script, {});
};

export const getFilterSelectorWithId = (id: string) => `:not(#${id} *[data-isslot="1"] *)`;

export const checkIfMobile = (env: Env) => {
  return env?.canvas?.type === 'mobile';
};

export const swapArr = (arr: any[], idx1: number, idx2: number) => {
  if (arr[idx1] && arr[idx2]) {
    const temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
  }
  return arr;
};

// 前端分页下，编辑表格数据回填
export const replacePageElements = (originalArray, replacementArray, paginationConfig) => {
  const startIndex =
    (paginationConfig.currentPage.pageNum - 1) * paginationConfig.currentPage.pageSize;
  const endIndex = startIndex + paginationConfig.currentPage.pageSize;

  // 将替换数组的元素插入到原始数组中
  for (let i = 0; i < replacementArray.length; i++) {
    if (replacementArray[i]._add) {
      // 如果有"_add"属性，表示要添加新元素
      replacementArray[i]._add = false;
      originalArray.push(replacementArray[i]);
    } else {
      // 否则，替换现有元素
      originalArray[startIndex + i] = replacementArray[i];
    }
  }

  return [...originalArray];
};

// IO串行处理
export const handleOutputFn = (
  relOutputs: { [x: string]: any },
  outputs: { [x: string]: any },
  OutputId: string,
  val: any
) => {
  const outputFn = relOutputs?.[OutputId] || outputs[OutputId];
  if (outputFn) {
    outputFn(val);
  }
};

const findLabelByOptions = (value, options) => {
  let res;
  (Array.isArray(options) ? options : []).forEach((item) => {
    if (res !== undefined) {
      return;
    } else if (item.value === value) {
      res = item.label;
    } else if (Array.isArray(item.children)) {
      res = findLabelByOptions(value, item.children);
    }
  });
  return res;
};
const getValueByOptions = (value, options) => {
  if (!Array.isArray(value)) {
    const temp = findLabelByOptions(value, options);
    return temp === undefined ? value : temp;
  } else {
    return value.map((item) => getValueByOptions(item, options));
  }
};
const runDisableScript = (disableScript, record) => {
  if (disableScript && record) {
    try {
      const disabled = eval(getTemplateRenderScript(disableScript))(record);
      return disabled;
    } catch (e) {
      console.error('动态禁用出错：' + e);
      return true;
    }
  }
  return undefined;
};

export { findLabelByOptions, getValueByOptions, runDisableScript };

import React from 'react';
import visibleOpt from '../../components/editorRender/visibleOpt';
import { message } from 'antd';
import {
  baseVerificationRules,
  ColorMap,
  ColumnItem,
  Data,
  TypeEnum,
  TypeEnumMap
} from '../constants';
import { uuid } from '../../utils';
import { setDataSchema } from '../schema';

const getAddColumnEditor = ({ data, output, input, slot, env }: EditorResult<Data>) => {
  return {
    title: '列',
    items: [
      {
        title: '',
        type: 'array',
        description: '手动添加表格列',
        options: {
          addText: '添加列',
          editable: true,
          customOptRender: visibleOpt,
          handleDelete: (item: ColumnItem) => item?.isRowKey || item?.valueType === 'option',
          tagsRender: (item: ColumnItem) =>
            item?.isRowKey ? [{ color: '#fa6400', text: '唯一Key' }] : [],
          getTitle: (item: ColumnItem) => {
            const path = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex;
            const { color, text } = ColorMap[item.dataSchema?.type] || ColorMap.string;
            if (item.visible) {
              return (
                <>
                  <span style={{ color }}>{text}</span>
                  <span>
                    {`【${item.width}px】`}
                    {env.i18n(item.title)}
                    {path ? `(${path})` : ''}
                  </span>
                </>
              );
            } else {
              return (
                <>
                  <span style={{ color }}>{text}</span>
                  <span>
                    【隐藏】{env.i18n(item.title)}
                    {path ? `(${path})` : ''}
                  </span>
                </>
              );
            }
          },
          onAdd: () => {
            const item: ColumnItem = {
              title: `列${data.columns.length}`,
              dataIndex: `列${data.columns.length}`,
              valueType: 'text',
              width: 140,
              align: 'left',
              key: uuid(),
              fieldProps: {},
              VerificationRules: baseVerificationRules,
              visible: true
            };
            data.columns.splice(data.columns.length - 1, 0, item);
            setDataSchema({ data, output, input, slot });
          },
          items: [
            {
              title: '列名',
              type: 'TextArea',
              options: {
                locale: true,
                autoSize: { minRows: 2, maxRows: 2 }
              },
              value: 'title'
            },
            {
              title: '字段',
              type: 'Text',
              value: 'dataIndex',
              ifVisible(item: ColumnItem) {
                return item.valueType !== 'option';
              },
              options: {
                placeholder: '不填默认使用 列名 作为字段'
              }
            },
            {
              title: '字段类型',
              type: 'Select',
              value: 'valueType',
              ifVisible(item: ColumnItem) {
                return item.valueType !== 'option';
              },
              options: {
                options: [
                  { label: TypeEnumMap[TypeEnum.Text], value: TypeEnum.Text },
                  { label: TypeEnumMap[TypeEnum.Number], value: TypeEnum.Number },
                  { label: TypeEnumMap[TypeEnum.Select], value: TypeEnum.Select },
                  { label: TypeEnumMap[TypeEnum.TreeSelect], value: TypeEnum.TreeSelect },
                  { label: TypeEnumMap[TypeEnum.Cascader], value: TypeEnum.Cascader },
                  { label: TypeEnumMap[TypeEnum.Switch], value: TypeEnum.Switch },
                  { label: TypeEnumMap[TypeEnum.Checkbox], value: TypeEnum.Checkbox },
                  { label: TypeEnumMap[TypeEnum.Date], value: TypeEnum.Date },
                  { label: TypeEnumMap[TypeEnum.DateRange], value: TypeEnum.DateRange },
                  { label: TypeEnumMap[TypeEnum.Slot], value: TypeEnum.Slot }
                ]
              }
            },
            {
              title: '设置为唯一key',
              type: 'switch',
              value: 'isRowKey',
              description:
                '当表格数据太大导致卡顿时，可以通过添加【行标识字段】进行性能优化。该标识字段的值需要全局唯一。此外也可以当作设置勾选数据时的标识',
              ifVisible(item: ColumnItem) {
                // 存量升级前不展示
                return typeof data?.hasUpdateRowKey !== 'undefined' && item.valueType !== 'option';
              }
            },
            {
              title: '宽度',
              type: 'Text',
              value: 'width',
              options: {
                type: 'number'
              }
            }
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [
              ...data.columns.map((item) => ({
                ...item,
                visible: item?.visible === undefined ? true : item?.visible
              }))
            ];
          },
          set({ data, output, input, slot, ...res }: EditorResult<Data>, val: ColumnItem[]) {
            let newRowKey = data?.rowKey;
            for (let item of val) {
              const { dataIndex, visible, valueType, title } = item;
              if (dataIndex === '') {
                item.dataIndex = String(title);
                message.warn(`表格列字段不能为空！`);
              }

              if (valueType === 'option') {
                data.hideAllOperation = !visible;
              }

              // 保证每次只有一个isRowKey是true
              if (item?.isRowKey && data.rowKey !== dataIndex) {
                newRowKey = String(item.dataIndex);
              }
              // 开启唯一key之后不能取消
              else if (data.rowKey === dataIndex && !item?.isRowKey) {
                // @ts-ignore
                item._renderKey = uuid(); // 新增一个随机的值renderKey刷新防止不更新
                message.warn(`必须设置一个唯一key`);
              }
            }

            data.rowKey = newRowKey;

            // @ts-ignore
            const cols: ColumnItem[] = val.map((item) => ({
              ...item,
              isRowKey: data?.rowKey && item?.dataIndex === data?.rowKey
            }));

            data.columns = cols;
            setDataSchema({ data, output, input, slot });
          }
        }
      }
    ]
  };
};

export default getAddColumnEditor;

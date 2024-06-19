import React, { useCallback } from 'react';
import { Button, Col, Form, Space, Image } from 'antd';
import * as Icons from '@ant-design/icons';
import { Action, Data, LocationEnum } from '../constants';
import css from './index.less';

/**
 * 操作项图标渲染
 * @param btn 按钮数据
 * @param data 组件数据
 * @returns JSX
 */
const getBtnIcon = (btn: Action) => {
  const { src, size, gutter, innerIcon, customIcon } = btn.iconConfig || {};
  if (src === 'custom' && customIcon)
    return (
      <Image
        className={css.image}
        //width={size[1] || 14} height={size[0] || 14}
        src={customIcon}
        preview={false}
      />
    );
  if (src === 'inner') {
    return (
      Icons && (
        <span
        //style={{ fontSize: Math.max(...size) }}
        >
          {Icons[innerIcon || ('EditOutlined' as string)]?.render()}
        </span>
      )
    );
  }

  return void 0;
};

const Actions = (props: RuntimeParams<Data>, record, editableKeys, rowKey) => {
  const { data, env, outputs } = props;

  const onClick = (item: Action) => {
    if (env.edit) return;
    const { _add: _, ...outputObject } = record;
    outputs[item.key] &&
      outputs[item.key]({ _isEdit: editableKeys.includes(record[rowKey]), ...outputObject });
  };

  //   const isLast =
  //     data.fields?.length === 0 ||
  //     (typeof fieldIndex === 'number' && fieldIndex === data.fields.length - 1);
  //   const listLength = data.fields.length;

  // 是否所有的按钮都隐藏，如果是，则操作区不应该占位
  // let isEmpty = true;

  if (!data.actions) {
    return [];
  }

  return data.actions.map((item) => {
    const { iconConfig, ...res } = item;
    const icon = getBtnIcon(item);
    // const permission = getWhatToDoWithoutPermission(item.permission, env);

    if (item.visible === false) {
      return null;
    }
    if (!env.edit) {
      //   if (permission.type !== 'none') {
      //     return null;
      //   }
      //   const dynamicDisplay = getDynamicDisplay(
      //     item,
      //     currentField,
      //     { isLast, listLength },
      //     props.onError
      //   );
      //   if (dynamicDisplay === false) {
      //     return null;
      //   }
    }
    // isEmpty = false;
    return (
      <Button
        key={item.key}
        data-form-actions-item={item.key}
        {...res}
        // disabled={data.disabled}
        onClick={() => onClick(item)}
      >
        <Space size={iconConfig?.gutter || 8}>
          {iconConfig?.location === LocationEnum.FRONT ? icon : void 0}
          {env.i18n(item.title)}
          {iconConfig?.location === LocationEnum.BACK ? icon : void 0}
        </Space>
      </Button>
    );
  });
};

// const ActionsWrapper = (props: RuntimeParams<Data> & FormListActionsProps) => {
//   const { data } = props;
//   const { align, widthOption, width, span, inlinePadding = [] } = data.readModeActions;
//   const padding = [...inlinePadding];

//   // const isLastField = fieldIndex === data.fields.length - 1;
//   // if (isLastField) padding[2] = 0;

//   const actionStyle: React.CSSProperties = {
//     textAlign: align
//     // padding: padding.map(String).map(unitConversion).join(' ')
//   };

//   const getFlexValue = useCallback(() => {
//     if (widthOption === 'px') {
//       return `0 0 ${width || 0}px`;
//     } else if (widthOption === 'flexFull') {
//       return 1;
//     }

//     return `0 0 ${(span * 100) / 24}%`;
//   }, [widthOption, width, span]);

//   const formItemProps = {
//     label: '',
//     colon: false
//   };
//   const FormActions = Actions(props);
//   console.log('---');

//   if (typeof FormActions !== 'boolean') {
//     return (
//       <Col data-form-actions flex={getFlexValue()} style={actionStyle}>
//         <Form.Item {...formItemProps} style={{ margin: 0 }}>
//           {FormActions}
//         </Form.Item>
//       </Col>
//     );
//   }
//   return null;
// };

export { Actions };

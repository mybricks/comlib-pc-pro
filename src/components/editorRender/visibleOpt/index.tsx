import React from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

export default ({ item, index, setList }) => {
  return (
    <div
      onClick={() => {
        setList((prev) => {
          const copy = [...prev];
          if (copy && copy[index]) {
            copy[index].visible = !copy[index].visible;
          }
          return copy;
        });
      }}
      // 样式被隔离了，没生效
      // className={css.wrap}
      style={{
        cursor: 'pointer',
        padding: '0 2px'
      }}
    >
      {item?.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
    </div>
  );
};

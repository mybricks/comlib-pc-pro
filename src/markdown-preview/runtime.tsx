import React, { useRef, useLayoutEffect, useEffect, useState, useMemo } from 'react';

//import Vditor from 'vditor/src/index';
//import Vditor from 'vditor'
//import 'vditor/dist/index.css';

import VditorPreview from 'vditor/dist/method';

export default function ({ env, inputs, outputs, data }) {
  const [ele, setEle] = useState<HTMLElement>();

  useMemo(() => {
    if (ele) {
      VditorPreview.preview(ele, data.content, {
        mode: 'light'
      });
    }
  }, [ele, data.content]);

  useEffect(() => {
    //注册输入项
    inputs['setContent']((val, rels) => {
      data.content = val;
      rels['setContentFinish'](data.content);
    });

    inputs['appendContent']((val, rels) => {
      data.content += val;
      rels['setContentFinish'](data.content);
    });
  }, []);

  return (
    <div
      ref={(ele) => {
        if (ele) {
          setEle(ele);
        }
      }}
    />
  );
}

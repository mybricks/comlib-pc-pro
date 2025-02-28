import React, { useRef, useLayoutEffect, useEffect, useState, useMemo } from 'react';
import css from './css.less';
//import Vditor from 'vditor/src/index';
//import Vditor from 'vditor'
import 'vditor/dist/index.css';

//import VditorPreview from 'vditor/dist/method';
import VditorPreview from 'vditor/src/method';

export default function ({ env, inputs, outputs, data }) {
  const containerEle = useRef<HTMLDivElement>();
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

      const conEle = containerEle.current;
      if (conEle) {
        requestAnimationFrame((v) => {
          conEle.scrollTop += 10000;
        });
      }
    });
  }, []);

  return (
    <div className={css.container} ref={containerEle}>
      <div
        ref={(ele) => {
          if (ele) {
            setEle(ele);
          }
        }}
      />
    </div>
  );
}

import React, { useRef, useLayoutEffect, useEffect, useState, useMemo } from 'react';

//import Vditor from 'vditor/src/index';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

export default function ({ env, inputs, outputs, data }) {
  const eleRef = useRef<HTMLElement>();
  const vditorRef = useRef<Vditor>();

  const vditorInstance = vditorRef.current;

  useMemo(() => {
    if (env.edit) {
      //只关注编辑态
      if (vditorInstance) {
        vditorInstance.updateToolbarConfig({ hide: data.hideToolbar });
      }
    }
  }, [vditorInstance, data.hideToolbar]);

  useEffect(() => {
    let vditor;
    if (eleRef.current) {
      vditor = new Vditor(eleRef.current, {
        cache: { id: 'vditor' },
        height: '100%',
        //mode: 'wysiwyg',
        toolbarConfig: { hide: data.hideToolbar },
        toolbar: ['bold', 'preview'],
        after: () => {
          vditor.setValue(data.content);

          vditorRef.current = vditor;
        }
      });

      //注册输入项
      inputs['setContent']((val) => {
        vditor.setValue(val);
      });
    }

    return () => {
      if (vditor) {
        vditor.destroy();
      }
    };
  }, []);

  return <div ref={eleRef} />;
}

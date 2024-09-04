import React, { useRef, useLayoutEffect, useCallback, useState } from 'react';
import type { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { Empty } from 'antd';
import styles from './styles.less';
import { Data, DataItem, InputIds, OutputIds } from './constant';
import { handleOutputFn } from '../utils';

export default function (props: RuntimeParams<Data>) {
  const { env, inputs, outputs, data } = props;
  const formRef = useRef<ProFormInstance>();
  const [columns, setColumns] = useState<ProFormColumnsType<DataItem>[]>([]);
  const { runtime } = env;

  useLayoutEffect(() => {
    if (runtime) {
      inputs[InputIds.Submit]((val: any, outputRels: any) => {
        formRef?.current?.validateFieldsReturnFormatValue?.().then((values) => {
          outputRels[OutputIds.OnFinishForRels](values);
        });
      });

      inputs[InputIds.SetFieldsValue]((val: any, outputRels: any) => {
        formRef?.current?.setFieldsValue(val);
        handleOutputFn(outputRels, outputs, 'data', val);
      });

      inputs[InputIds.SetColumns]((val: Array<any>, outputRels: any) => {
        setColumns(val);
        handleOutputFn(outputRels, outputs, 'data', val);
      });
    }
  }, []);

  const onFinish = useCallback((values) => {
    outputs[OutputIds.OnFinish](values);
  }, []);

  const onReset = useCallback(() => {
    outputs[OutputIds.OnReset]();
  }, []);

  const onValuesChange = useCallback((changedValues, allValues) => {
    outputs[OutputIds.OnValuesChange]({ changedValues, allValues });
  }, []);

  return (
    <>
      {columns?.length > 0 ? (
        <BetaSchemaForm<DataItem>
          {...data.config}
          formRef={formRef}
          submitter={data.submitter}
          layoutType={data.layoutType}
          autoFocusFirstInput={false}
          columns={columns}
          grid={!['QueryFilter', 'LightFilter'].includes(data.layoutType || 'Form') && data.grid}
          onFinish={async (values) => {
            onFinish(values);
          }}
          onReset={() => {
            onReset();
          }}
          onValuesChange={onValuesChange}
        ></BetaSchemaForm>
      ) : (
        <div className={styles.empty}>
          <Empty description="请输入Schema描述" />
        </div>
      )}
    </>
  );
}

import React, { useRef, useLayoutEffect, useCallback, useState } from 'react';
import type {
  ProFormColumnsType,
  ProFormInstance,
  ProFormLayoutType,
  SubmitterProps
} from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { Empty, FormProps } from 'antd';
import styles from './styles.less';
import { InputIds, OutputIds } from './constant';

export interface Data {
  layoutType: ProFormLayoutType;
  grid: boolean;
  submitter: false | SubmitterProps;
  config: FormProps;
}

type DataItem = {
  name: string;
  state: string;
};

export default function (props: RuntimeParams<Data>) {
  const { env, inputs, outputs, data } = props;
  const formRef = useRef<ProFormInstance>();
  const [columns, setColumns] = useState<ProFormColumnsType<DataItem>[]>([]);

  useLayoutEffect(() => {
    inputs[InputIds.Submit]((val, outputRels) => {
      formRef?.current?.validateFieldsReturnFormatValue?.().then((values) => {
        console.log(values);
        outputRels[OutputIds.OnFinishForRels](values);
      });
    });

    inputs[InputIds.SetFieldsValue]((val) => {
      formRef?.current?.setFieldsValue(val);
    });

    inputs[InputIds.SetColumns]((val) => {
      setColumns(val);
    });
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

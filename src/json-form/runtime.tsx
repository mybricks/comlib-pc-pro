import React, { useRef, useLayoutEffect, useCallback, useState } from 'react';
import type {
  ProFormColumnsType,
  ProFormInstance,
  ProFormLayoutType
} from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { Empty } from 'antd';
import styles from './styles.less';

export interface Data {
  layoutType: ProFormLayoutType;
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
    inputs['submit']((val, outputRels) => {
      formRef?.current?.validateFieldsReturnFormatValue?.().then((values) => {
        console.log(values);
        outputRels['onFinishForRels'](values);
      });
    });

    inputs['setFieldsValue']((val) => {
      formRef?.current?.setFieldsValue(val);
    });

    inputs['setColumns']((val) => {
      setColumns(val);
    });
  }, []);

  const onFinish = useCallback((values) => {
    outputs['onFinish'](values);
  }, []);

  const onReset = useCallback(() => {
    outputs['onReset']();
  }, []);

  return (
    <>
      {columns?.length > 0 ? (
        <BetaSchemaForm<DataItem>
          formRef={formRef}
          layoutType={data.layoutType}
          autoFocusFirstInput={false}
          columns={columns}
          onFinish={async (values) => {
            onFinish(values);
          }}
          onReset={() => {
            onReset();
          }}
        ></BetaSchemaForm>
      ) : (
        <div className={styles.empty}>
          <Empty description="请输入Schema描述" />
        </div>
      )}
    </>
  );
}

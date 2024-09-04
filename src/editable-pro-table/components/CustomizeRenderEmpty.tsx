import React from 'react';
import { Image } from 'antd';

const CustomizeRenderEmpty = (
  image: string,
  description: string,
  styles: Record<string, any>
): React.JSX.Element => (
  <div className={`emptyNormal ${styles.emptyNormal}`}>
    <Image src={image} className={`emptyImage ${styles.emptyImage}`} preview={false} />
    <p className={`emptyDescription ${styles.emptyDescription}`}>{description}</p>
  </div>
);

export { CustomizeRenderEmpty };

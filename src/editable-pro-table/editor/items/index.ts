import { Data } from '../../constants';
import indexEditor from '../indexEditor';
import baseEditor from './baseEditor';
import styleEditor from './styleEditor';
import switchEditor from './switchEditor';
import TitleTipEditor from './tooltips';
import operationRowEditor from './operationRowEditor';
import dateEditor from './dateEditor';
import selectEditor from './selectEditor';
import proEditor from './proEditor';

export const COLUMN_EDITORS_CLASS_KEY =
  '.ant-table-thead .ant-table-cell:not(.ant-table-selection-column):not(.ant-table-cell-scrollbar):not(.ant-table-row-expand-icon-cell):not(.column-draggle)';
export default {
  [COLUMN_EDITORS_CLASS_KEY]: ({ data }: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      baseEditor,
      indexEditor
    ];

    cate2.title = '样式';
    cate2.items = [styleEditor, TitleTipEditor];

    cate3.title = '高级';
    cate3.items = [
      proEditor(data),
      operationRowEditor(data),
      switchEditor,
      dateEditor,
      selectEditor
    ];
    return {
      title: '列'
    };
  }
};

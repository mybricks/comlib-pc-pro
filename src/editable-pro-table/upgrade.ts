import { Data } from './constants';

export default function ({ 
  data, 
  input,
  output
}: UpgradeParams<Data>): boolean {
  //1.0.13 -> 1.0.14
  let key: Array<any> = [];
  key = data.columns.map((item)=>{
    return item.dataIndex
  });
  let newkey: Array<any> = [];
  newkey = key.filter((item)=>{
    return item !== undefined
  })
  let childSchema = {};
  for(let i=0; i < newkey.length; i++) {
    childSchema[newkey[i]] = { type: 'string' }
  }
  const schema = { type: 'object', propperties: childSchema }
  //输入数据
  const value = input.get('value');
  value.setSchema(schema);
  //输出数据
  const submit = output.get('submit');
  submit.setSchema(schema)

  // 表头滚动
  if (data.fixedHeader === undefined) {
    data.fixedHeader = false;
  }
  if (data.scroll === undefined) {
    data.scroll = {
      y: ""
    };
  }

  if (!data.editType) {
    data.editType = "multiple";
  }

  return true;
}

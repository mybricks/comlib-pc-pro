function uuid(pre = 'u_', len = 6) {
  const seed = 'abcdefhijkmnprstwxyz0123456789',
    maxPos = seed.length;
  let rtn = '';
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}

function unitConversion(value: string) {
  if (/^\d+(?:%)$/.test(value)) {
    return value;
  } else if (/^(?:calc)/.test(value)) {
    return value;
  } else {
    return /^\d+(?:px)?$/.test(value) ? parseInt(value, 10) + 'px' : void 0;
  }
}

function deepCopy(obj: any, cache: any = []) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const hit: any = cache.filter((c: any) => c.original === obj)[0];
  if (hit) {
    return hit.copy;
  }
  const copy: any = Array.isArray(obj) ? [] : {};

  cache.push({
    original: obj,
    copy
  });

  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
}

const isNullValue = (value: any) => {
  return value === null || value === undefined || value === '';
};

export const defaultValidatorExample =
  encodeURIComponent(`export default function(value,  { success, error }) {
  if (!value) {
    error("内容不能为空");
  } else {
    success();
  }
}
`);

/**
 * 判断是否为空 undefined、null、空字符串返回true
 * @param value 入参
 */
export function isEmpty(value: unknown): value is undefined | null | '' {
  return value === undefined || value === null || value === ''
}


export { uuid, unitConversion, deepCopy, isNullValue };
export * from './upgrade';
export * from './runExpCodeScript';

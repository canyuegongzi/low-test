import { isObject } from './is-object';


export function isJSExpression(data: any) {
  if (!isObject(data)) {
    return false;
  }
  return data.type === 'JSExpression' && data.extType !== 'function';
}

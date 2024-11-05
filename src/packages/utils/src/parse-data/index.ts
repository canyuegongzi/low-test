import {isJSExpression} from "../is-jsexpression.ts";
import {isString} from "../is-string.ts";

/**
 * check if current page is nested within another page with same host
 * @returns boolean
 */
export function inSameDomain() {
  try {
    return window.parent !== window && window.parent.location.host === window.location.host;
  } catch (e) {
    return false;
  }
}
/**
 * 对象类型JSExpression，支持省略this
 * @returns funtion
 * @param options
 */

function parseExpression(options: {
  str: any; self: any; thisRequired?: boolean; logScope?: string; [key: string]: any
}): any;
function parseExpression(str: any, self: any, thisRequired?: boolean): any;
function parseExpression(a: any, b?: any, c = false) {
  let str;
  let self;
  let thisRequired;
  let errCallback;
  // @ts-ignore
  let logScope;
  if (typeof a === 'object' && b === undefined) {
    str = a.str;
    self = a.self;
    thisRequired = a.thisRequired;
    errCallback = a.errCallback;
    logScope = a.logScope;
  } else {
    str = a;
    self = b;
    thisRequired = c;
  }
  try {
    const contextArr = ['"use strict";', 'var __self = arguments[0];'];
    contextArr.push('return ');
    let tarStr: string;

    tarStr = (str.value || '').trim();

    // NOTE: use __self replace 'this' in the original function str
    // may be wrong in extreme case which contains '__self' already
    tarStr = tarStr.replace(/this(\W|$)/g, (_a: any, b: any) => `__self${b}`);
    tarStr = contextArr.join('\n') + tarStr;

    // 默认调用顶层窗口的parseObj, 保障new Function的window对象是顶层的window对象
    if (inSameDomain() && (window.parent as any).__newFunc) {
      return (window.parent as any).__newFunc(tarStr)(self);
    }
    const code = `with(${thisRequired ? '{}' : '$scope || {}'}) { ${tarStr} }`;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function('$scope', code)(self);
  } catch (err) {
    // console.log(err);
    errCallback?.(err);
    return undefined;
  }
}

export {
  parseExpression,
};

export function parseThisRequiredExpression(str: any, self: any) {
  return parseExpression(str, self, true);
}


/**
 * for each key in targetObj, run fn with the value of the value, and the context paased in.
 * @param targetObj object that keys will be for each
 * @param fn function that process each item
 * @param context
 */
export function forEach(targetObj: any, fn: any, context?: any) {
  if (!targetObj || Array.isArray(targetObj) || isString(targetObj) || typeof targetObj !== 'object') {
    return;
  }

  Object.keys(targetObj).forEach((key) => fn.call(context, targetObj[key], key));
}
interface IParseOptions {
  thisRequiredInJSE?: boolean;
  logScope?: string;
  [key: string]: any
}
export function parseData(schema: unknown, self: any, options: IParseOptions = {}): any {
  if (isJSExpression(schema)) {
    return parseExpression({
      str: schema,
      self,
      thisRequired: options.thisRequiredInJSE,
      logScope: options.logScope,
      errCallback: options?.errCallback
    });
  } else if (typeof schema === 'string') {
    return schema.trim();
  } else if (Array.isArray(schema)) {
    return schema.map((item) => parseData(item, self, options));
  } else if (typeof schema === 'function') {
    return schema.bind(self);
  } else if (typeof schema === 'object') {
    // 对于undefined及null直接返回
    if (!schema) {
      return schema;
    }
    const res: any = {};
    forEach(schema, (val: any, key: string) => {
      if (key.startsWith('__')) {
        return;
      }
      res[key] = parseData(val, self, options);
    });
    return res;
  }
  return schema;
}

export function detectType(input: any): string {
  if (typeof input === 'string') {
    return 'string';
  } else if (typeof input === 'number') {
    return 'number';
  } else if (typeof input === 'boolean') {
    return 'boolean';
  } else if (Array.isArray(input)) {
    return 'array';
  } else if (input === null) {
    return 'null';
  } else if (typeof input === 'object') {
    return 'object';
  } else if (typeof input === 'undefined') {
    return 'undefined';
  } else if (typeof input === 'function') {
    return 'function';
  } else {
    return 'unknown';
  }
}
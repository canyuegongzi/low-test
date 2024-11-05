import { DataSourceValue, EmitParamValueTable} from "../type.ts";



// 递归处理多层结构
export const updateState = (value: EmitParamValueTable[], scope: any, flowScope: any) => {
  const utils = scope?.utils;
  const parseData = (jsValue: DataSourceValue, config= {}) => {

    if (jsValue?.value && utils?.isJSExpression?.(jsValue.value) && jsValue.valueType === 'flowRunningTime') {
      return utils?.parseData(jsValue.value, flowScope, config);
    }

    if (jsValue?.value && utils?.isJSExpression?.(jsValue.value)) {
      return utils?.parseData(jsValue.value, scope, config);
    }

    if (jsValue.type === 'number') {
      return Number(jsValue.value)
    }
    if (jsValue.type === 'boolean') {
      return jsValue.value === 'true' || (jsValue.value as any) === true;
    }

    return jsValue.value

  }

  const updatePageState = (path: string, value: any) => {
    console.log("updatePageState")
    console.log(path, value)
    scope?.setState?.((prevState: any) => {
      const newState = { ...prevState };
      const keys = path.split('.');

      keys.reduce((acc, key, idx) => {
        // 检查是否到达路径的最后一层
        if (idx === keys.length - 1) {
          acc[key] = value;
        } else {
          // 如果路径不存在，创建一个空对象
          if (!acc[key]) acc[key] = {};
        }
        return acc[key];
      }, newState);

      return newState;
    });
  }

  // 处理当前层级的 value 条件
  value.map(({ source, target }) => {
    const valueType = source.valueType;
    const sourceKey = source.value?.value?.split('.').slice(2)?.join?.('.')
    const targetValue = parseData(
      target,
      {
        thisRequiredInJSE: true,
        errCallback: (err: any) => {
          console.log(err)
        }
      });

    if (valueType === 'pageState') {
      updatePageState(sourceKey, targetValue)
    }
  });
};
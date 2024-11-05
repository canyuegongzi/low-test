import {ConditionsEmitValueConfig, DataSourceValue} from "../type.ts";

type Condition = ConditionsEmitValueConfig

// 解析操作符和条件

const evaluateCondition = (sourceValue: any, targetValue: any, operate: string): boolean => {
  switch (operate) {
    case '=':
    case '===':
      return sourceValue === targetValue;
    case '!=':
    case '!==':
      return sourceValue !== targetValue;
    case '>':
      return sourceValue > targetValue;
    case '>=':
      return sourceValue >= targetValue;
    case '<':
      return sourceValue < targetValue;
    case '<=':
      return sourceValue <= targetValue;
    default:
      throw new Error(`Unsupported operator: ${operate}`);
  }
};

// 递归处理多层结构
export const evaluate = (condition: Condition, scope: any, flowScope: any): boolean => {

  const utils = scope?.utils;

  const { relation = 'AND', conditions = [], value = [] } = condition;

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

  // 处理当前层级的 conditions（嵌套结构）
  const conditionResults = conditions.map((t) => evaluate(t, scope, flowScope));

  // 处理当前层级的 value 条件
  const valueResults = value.map(({ operate, source, target }) => {
    const sourceValue = parseData(
      source,
      {
        thisRequiredInJSE: true,
        errCallback: (err: any) => {
         console.log(err)
        }
      });
    const targetValue = parseData(
      target,
      {
        thisRequiredInJSE: true,
        errCallback: (err: any) => {
          console.log(err)
        }
      });
    return evaluateCondition(sourceValue, targetValue, operate);
  });

  // 将所有结果合并
  const allResults = [...conditionResults, ...valueResults];

  // 根据 relation 合并结果（AND 或 OR）
  if (relation === 'AND') {
    return allResults.every(Boolean);
  } else if (relation === 'OR') {
    return allResults.some(Boolean);
  }

  throw new Error(`Unknown relation: ${relation}`);
};
export type ValueType = 'option' | 'input' | 'component' | 'componentProp' | 'dataSource' | 'dataConvert' | 'urlParam' | 'initParam' | 'flowRunningTime' | 'pageState'
export type NormalValueType = 'string' | 'number' | 'boolean' | 'undefined' | 'null' | 'object' | 'array[string]' | 'array[number]'
export type DataSourceValue = {
  valueType: ValueType;
  type: NormalValueType;
  value: string & { value: string; type: 'JSExpression'};
}

export interface EmitParamCollectorValue {
  value: DataSourceValue;
  key: string;
}

export interface EmitParamValueTable {
  source: DataSourceValue;
  target: DataSourceValue;
  operate: OperateType
}
export type OperateType = '=' | '>' | '<' | '>=' | '<=' | 'in' | 'reg'
export interface ConditionsEmitValueConfig {
  relation: 'OR' | 'AND'
  value?: EmitParamValueTable[];
  conditions?: ConditionsEmitValueConfig[]
}
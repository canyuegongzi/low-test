import styles from './index.module.scss'

import type {EditableFormInstance, ProColumns, ProFormInstance,} from '@ant-design/pro-components';
import {EditableProTable, ProForm} from '@ant-design/pro-components';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Dropdown, Input, Select, Space, TreeSelect, Typography} from "antd";
import classNames from "classnames";
import {ArrowsAltOutlined} from "@ant-design/icons";
import SelectVariable, {EmitSelectVariableValue} from "../selectVariable";
import CoreContext from "../../context/core.ts";
import {isJSExpression} from "../../../../utils/src/is-jsexpression.ts";


export type ValueType = 'option' | 'input' | 'pageState' | 'componentProp' | 'dataSource' | 'dataConvert' | 'urlParam' | 'initParam' | string
export type KeyType = 'custom'
export const valueCollectorMap: Record<ValueType, { label: string; icon: string; value: ValueType; }> = {
  input: {
    label: '手动输入',
    value: 'input',
    icon: 'icon-edit-outline'
  },
  pageState: {
    label: '页面状态',
    value: 'pageState',
    icon: 'icon-cpu'
  },
  componentProp: {
    label: '组件属性值',
    value: 'componentProp',
    icon: 'icon-connection'
  },
  dataSource: {
    label: '数据节点返回值',
    value: 'dataSource',
    icon: 'icon-receiving'
  },
  dataConvert: {
    label: '转换节点返回值',
    value: 'dataConvert',
    icon: 'icon-s-operation'
  },
  urlParam: {
    label: '路由参数属性值',
    value: 'urlParam',
    icon: 'icon-link'
  },
  initParam: {
    label: '宿主系统变量属性值',
    value: 'initParam',
    icon: 'icon-attract'
  }
}

export type NormalValueType = 'string' | 'number' | 'boolean' | 'undefined' | 'null' | 'object' | 'array[string]' | 'array[number]'
export type OperateType = '=' | '>' | '<' | '>=' | '<=' | 'in' | 'reg'

interface OperateItem {
  value: OperateType;
  label: string;
}
const operateList: OperateItem[] = [
  {
    value: '=',
    label: '=',
  },
  {
    value: '>',
    label: '>',
  },
  {
    value: '<',
    label: '<',
  },
  {
    value: '>=',
    label: '>=',
  },
  {
    value: '<=',
    label: '<=',
  },
  {
    value: 'in',
    label: 'in',
  },
  {
    value: 'reg',
    label: 'reg',
  }
]
export const NormalValueTypeOptions: {value: string; label: string}[] = [{
  value: 'string',
  label: 'string',
}, {
  value: 'number',
  label: 'number',
}, {
  value: 'boolean',
  label: 'boolean',
}, {
  value: 'undefined',
  label: 'undefined',
}, {
  value: 'null',
  label: 'null',
}, {
  value: 'object',
  label: 'object',
}, {
  value: 'array[string]',
  label: 'array[string]',
}, {
  value: 'array[number]',
  label: 'array[number]',
}]

type DataSourceValue = {
  valueType: ValueType;
  type: NormalValueType;
  value: string;
}

export interface EmitParamValueTable {
  source: DataSourceValue;
  target: DataSourceValue;
  operate: OperateType
}
interface DataSourceType extends EmitParamValueTable{
  id?: string;
  children?: DataSourceType[];
}

interface ParamCollectorIProps {
  onChange: (arg0: any) => void;
  value: DataSourceType[];
}

const CustomInputComponent: React.FC<{ value?: string; onChange?: (value: string,) => void}> = (props) => {
  return (
    <Input placeholder={'请输入'} value={props.value} onChange={(e) => {
      props?.onChange?.(e.target.value)
    }} className={styles['form-key-item-input']}></Input>
  )
}

/**
 * 页面状态的选择组件
 * @param props
 * @constructor
 */
const CustomPageStateComponent: React.FC<{ value?: string; onChange?: (value: any,) => void}> = (props) => {
  const { variableProvideConfig } = useContext(CoreContext)
  const { pageStates = [] } = variableProvideConfig || {};


  const pageStatesTreeData = useMemo(() => {
    if (typeof pageStates === 'function') {
      return pageStates?.()
    }
    return pageStates
  }, [pageStates])


  return (
    <TreeSelect
      popupClassName={styles.customPageStateTreeSelect}
      showSearch
      className={styles['form-key-item-input']}
      style={{ width: '100%' }}
      value={props.value}
      onChange={(e) => {
        props?.onChange?.(e)
      }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      allowClear
      treeDefaultExpandAll
      treeData={pageStatesTreeData}
      fieldNames={{
        label: 'name',
        value: 'value',
        children: 'children'
      }}
    />
  )
}

/**
 * 页面路由参数的选择组件
 * @param props
 * @constructor
 */
const CustomUrlParamsStateComponent: React.FC<{ value?: string; onChange?: (value: any,) => void}> = (props) => {
  const { variableProvideConfig } = useContext(CoreContext)
  const { systemRouterParams = [] } = variableProvideConfig || {};


  const systemRouterParamsTreeData = useMemo(() => {
    if (typeof systemRouterParams === 'function') {
      return systemRouterParams?.()
    }
    return systemRouterParams
  }, [systemRouterParams])


  return (
    <TreeSelect
      popupClassName={styles.customPageStateTreeSelect}
      showSearch
      className={styles['form-key-item-input']}
      style={{ width: '100%' }}
      value={props.value}
      onChange={(e) => {
        props?.onChange?.(e)
      }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      allowClear
      treeDefaultExpandAll
      treeData={systemRouterParamsTreeData}
      fieldNames={{
        label: 'name',
        value: 'value',
        children: 'children'
      }}
    />
  )
}

/**
 * 系统参数
 * @param props
 * @constructor
 */
const CustomInitParamsStateComponent: React.FC<{ value?: string; onChange?: (value: any,) => void}> = (props) => {
  const { variableProvideConfig } = useContext(CoreContext)
  const { systemDevice = [] } = variableProvideConfig || {};


  const systemRouterParamsTreeData = useMemo(() => {
    if (typeof systemDevice === 'function') {
      return systemDevice?.()
    }
    return systemDevice
  }, [systemDevice])


  return (
    <TreeSelect
      popupClassName={styles.customPageStateTreeSelect}
      showSearch
      className={styles['form-key-item-input']}
      style={{ width: '100%' }}
      value={props.value}
      onChange={(e) => {
        props?.onChange?.(e)
      }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      allowClear
      treeDefaultExpandAll
      treeData={systemRouterParamsTreeData}
      fieldNames={{
        label: 'name',
        value: 'value',
        children: 'children'
      }}
    />
  )
}
interface EmitSetterValue {
  valueType: ValueType,
  value: any;
  type: NormalValueType;
}

export const SetterValueComponent: React.FC<{ getPopupContainer?: any; value?: EmitSetterValue; onChange?: (value: EmitSetterValue,) => void}> = (props) => {
  const [valueType, setValueType] = useState<ValueType>(props?.value?.valueType || 'input');
  const [normalValueType, _setNormalValueType] = useState<NormalValueType>(props?.value?.type || 'string');
  const [currentValue, setCurrentValue] = useState<string>(props?.value?.value || '');

  const valueTypeInfo = useMemo(() => {
    return valueCollectorMap[valueType]
  }, [valueType])

  useEffect(() => {
    const value = {
      valueType,
      value:  currentValue,
      type: normalValueType
    }
    props?.onChange?.(value)
  }, [valueType, currentValue, normalValueType])
  return (
    <div className={styles.inputValueContainer}>
      <Dropdown
        menu={{
          items: Object.values(valueCollectorMap).map(item => {
            return {
              key: item.value,
              label: item.label,
            }
          }),
          selectable: true,
          selectedKeys: [valueType],
          onSelect: (e) => {
            setValueType(e.key)
          }
        }}
      >
        <Typography.Link>
          <Space>
            <div className={styles.inputValueTypeSelect}>
              <i className={classNames({
                'iconfont': true,
                [valueTypeInfo.icon]: true,
                [styles.icon]: true,
              })} ></i>
              {/*<Icon type={valueTypeInfo.icon}></Icon>*/}
            </div>
          </Space>
        </Typography.Link>
      </Dropdown>
      {
        ['input', 'initParam'].includes(valueType) && (
          <CustomInputComponent value={currentValue} onChange={(e) => {
            setCurrentValue(e);
          }} />
        )
      }
      {
        ['pageState'].includes(valueType) && (
          <CustomPageStateComponent value={currentValue} onChange={(e) => {
            setCurrentValue(e);
          }} />
        )
      }
      {
        ['urlParam'].includes(valueType) && (
          <CustomUrlParamsStateComponent value={currentValue} onChange={(e) => {
            setCurrentValue(e);
          }} />
        )
      }
      {
        ['initParam'].includes(valueType) && (
          <CustomInitParamsStateComponent value={currentValue} onChange={(e) => {
            setCurrentValue(e);
          }} />
        )
      }
    </div>
  )
}


const SetterValueComponentV2: React.FC<{ getPopupContainer?: any; value?: EmitSelectVariableValue; onChange?: (value: EmitSelectVariableValue,) => void}> = (props) => {

  const { renderRefInstance } = useContext(CoreContext)

  const [currentValue, setCurrentValue] = useState<EmitSelectVariableValue>({
    value: '',
    valueType: 'input',
    type: 'string'
  })

  useEffect(() => {
    setCurrentValue?.(props?.value as EmitSelectVariableValue)
  }, [props.value]);


  const [open, setOpen] = useState(false);
  useEffect(() => {

  }, [])
  const inputValue = useMemo(() => {
    if (currentValue) {
      if (isJSExpression(currentValue.value)){
        return (currentValue as any)?.value?.value
      }
      return currentValue.value

    }
    return '';
  }, [currentValue])
  return (
    <div className={styles.inputValueContainer}>
      <SelectVariable
        open={open}
        value={currentValue}
        config={{
          self: renderRefInstance
        }}
        onChange={(e) => {
          setCurrentValue(e);
          props?.onChange?.(e)
          setOpen(false);
      }} />
      <Input
        placeholder={'请输入'}
        value={inputValue}
        onChange={(e) => {
          const val = {
            ...currentValue,
            valueType: 'input',
            value: e.target.value
          }
          setCurrentValue(val)
          props?.onChange?.(val)
        }}
        className={classNames(styles['form-key-item-input'], styles['form-key-item-input-container'])}
        suffix={<ArrowsAltOutlined onClick={(e) =>{
          e.stopPropagation();
          setOpen(true);
        }} className={styles['form-key-item-input-after-icon']} />}

      ></Input>

    </div>
  )
}


export const ParamValueTable = (_props: ParamCollectorIProps) => {
  const tableId = useRef<string>(`table-${(Math.random() * 1000000).toFixed(0)}-panel`)
  const [tableData, setTableData] = useState<DataSourceType[]>(() => {
    return _props.value.map(item => {
      return {
        ...item,
        id: (Math.random() * 1000000).toFixed(0),
      };
    });
  })

  const [position, _setPosition] = useState<'top' | 'bottom' | 'hidden'>(
    'bottom',
  );
  const editableKeys = useMemo<React.Key[]>(() => {
    return (tableData || []).map(item => item.id) as React.Key[];
  }, [tableData])
  const [controlled, _setControlled] = useState<boolean>(false);
  const formRef = useRef<ProFormInstance<any>>();
  const editorFormRef = useRef<EditableFormInstance<DataSourceType>>();
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'SOURCE',
      key: 'source',
      dataIndex: 'source',
      renderFormItem: () => <SetterValueComponentV2 getPopupContainer={(_node: HTMLElement) =>{
        return document.querySelector(`#${tableId.current}`)
      }} />
    },
    {
      width: 70,
      title: '操作符',
      key: 'operate',
      dataIndex: 'operate',
      renderFormItem: () => <Select options={operateList} />
    },
    {
      title: 'TARGET',
      key: 'target',
      dataIndex: 'target',
      renderFormItem: () => <SetterValueComponentV2 getPopupContainer={(_node: HTMLElement) =>{
        return document.querySelector(`#${tableId.current}`)
      }} />
    },
    {
      title: '操作',
      width: 40,
      valueType: 'option',
    },
  ];

  useEffect(() => {
    const list: EmitParamValueTable[] = tableData.map(item => {
      const { id, ...args} = item
      return { ...args }
    }) as EmitParamValueTable[];
    console.log("list", list)
    _props.onChange?.(list)
  }, [tableData]);

  return (
    <div className={styles.paramCollectorContainer}>
      <ProForm<{
        table: DataSourceType[];
      }>
        formRef={formRef}
        initialValues={{
          table: tableData,
        }}
        validateTrigger="onBlur"
        submitter={false}
        size={'middle'}
        onValuesChange={(_v: any, r: any) => {
          // const rows = editorFormRef.current?.getRowsData?.();
          setTableData(r.table);
        }}
      >
        <EditableProTable<DataSourceType>
          id={tableId.current as any}
          rowKey="id"
          size={'middle'}
          editableFormRef={editorFormRef}
          className={styles.table}
          name="table"
          bordered
          controlled={controlled}
          recordCreatorProps={
            position !== 'hidden'
              ? {
                position: position as 'top',
                creatorButtonText: '添加且关系',
                record: () => ({
                  id: (Math.random() * 1000000).toFixed(0),
                  operate: '=',
                  source: {},
                  target: {},
                }),
              } as any
              : false
          }
          toolBarRender={false}
          columns={columns}
          editable={{
            type: 'multiple',
            editableKeys: editableKeys,
            onChange: () => {
            },
            actionRender: (record, _config, _defaultDom) => {
              return [
                (
                  <a
                    key="delete"
                    onClick={() => {
                      const tableDataSource = formRef.current?.getFieldValue('table') as DataSourceType[];

                      const list = tableDataSource.filter((item) => item.id !== record.id)
                      formRef.current?.setFieldsValue({
                        table: list
                      });
                      _props?.onChange(list)
                    }}
                  >
                    删除
                  </a>
                )
              ];
            },
          }}
          scroll={{
            x: 300
          }}
        />
      </ProForm>
    </div>
  )
}

import styles from './index.module.scss'

import type {EditableFormInstance, ProColumns, ProFormInstance,} from '@ant-design/pro-components';
import {EditableProTable, ProForm} from '@ant-design/pro-components';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Input, Select, Space} from "antd";


export type ValueType = 'option' | 'input' | 'component' | 'componentProp' | 'dataSource' | 'dataConvert' | 'urlParam' | 'initParam'
export type KeyType = 'custom'
export const valueCollectorMap: Record<ValueType, { label: string; icon: string; value: ValueType; }> = {
  option: {
    label: '默认选项',
    value: 'option',
    icon: 'el-icon-folder-opened'
  },
  input: {
    label: '手动输入',
    value: 'input',
    icon: 'el-icon-edit-outline'
  },
  component: {
    label: '页面组件值',
    value: 'component',
    icon: 'el-icon-cpu'
  },
  componentProp: {
    label: '页面组件属性值',
    value: 'componentProp',
    icon: 'el-icon-connection'
  },
  dataSource: {
    label: '数据节点返回值',
    value: 'dataSource',
    icon: 'el-icon-receiving'
  },
  dataConvert: {
    label: '转换节点返回值',
    value: 'dataConvert',
    icon: 'el-icon-s-operation'
  },
  urlParam: {
    label: '路由参数属性值',
    value: 'urlParam',
    icon: 'el-icon-link'
  },
  initParam: {
    label: '宿主系统变量属性值',
    value: 'initParam',
    icon: 'el-icon-attract'
  }
}

export type NormalValueType = 'string' | 'number' | 'boolean' | 'undefined' | 'null' | 'object' | 'array[string]' | 'array[number]'
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

export interface EmitParamCollectorValue {
  value: DataSourceValue;
  key: string;
}
interface DataSourceType extends EmitParamCollectorValue{
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

interface EmitSetterValue {
  valueType: ValueType,
  value: any;
  type: NormalValueType;
}

const SetterValueComponent: React.FC<{ getPopupContainer?: any; value?: EmitSetterValue; onChange?: (value: EmitSetterValue,) => void}> = (props) => {
  const [valueType, setValueType] = useState<ValueType>(props?.value?.valueType || 'input');
  const [normalValueType, _setNormalValueType] = useState<NormalValueType>(props?.value?.type || 'string');
  const [currentValue, setCurrentValue] = useState<string>(props?.value?.value || '');

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
      <Space.Compact block>
        <Select
          className={styles.inputValueTypeSelect}
          getPopupContainer={(_e: HTMLElement) => {
            return props?.getPopupContainer?.() || document.body;
          }}
          options={Object.values(valueCollectorMap).map(item => {return {value: item.value, label: item.label}})} value={valueType}
          onChange={item => {
            setValueType(item)
          }}
        >
        </Select>
        {
          ['input', 'urlParam', 'initParam'].includes(valueType) && (
            <CustomInputComponent value={currentValue} onChange={(e) => {
              setCurrentValue(e);
            }} />
          )
        }
      </Space.Compact>
    </div>
  )
}

export const ParamCollector = (_props: ParamCollectorIProps) => {
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
      title: 'KEY',
      dataIndex: 'key',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: 126,
      className: styles['form-item-container'],
      renderFormItem: () => <CustomInputComponent />
    },
    {
      title: 'VALUE',
      key: 'value',
      width: 235,
      dataIndex: 'value',
      renderFormItem: () => <SetterValueComponent getPopupContainer={(_node: HTMLElement) =>{
        return document.querySelector(`#${tableId.current}`)
      }} />
    },
    {
      title: '操作',
      valueType: 'option',
    },
  ];

  useEffect(() => {
    const list: EmitParamCollectorValue[] = tableData.map(item => {
      const { id, ...args} = item
      return { ...args }
    }) as EmitParamCollectorValue[];
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
                creatorButtonText: '添加自定义参数',
                record: () => ({
                  id: (Math.random() * 1000000).toFixed(0),
                  key: `key_${(Math.random() * 1000000).toFixed(0)}`,
                  value: {} }),
              } as any
              : false
          }
          toolBarRender={false}
          columns={columns}
          editable={{
            type: 'multiple',
            editableKeys: editableKeys,
            onChange: () => {},
            actionRender: (record, _config, _defaultDom) => {
              return [
                (
                  <a
                    key="delete"
                    onClick={() => {
                      const tableDataSource = formRef.current?.getFieldValue('table') as DataSourceType[];

                      formRef.current?.setFieldsValue({
                        table: tableDataSource.filter((item) => item.key !== record.key),
                      });

                      _props.onChange?.(tableDataSource.filter((item) => item.key !== record.key))
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

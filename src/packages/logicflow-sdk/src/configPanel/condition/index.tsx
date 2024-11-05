import {Input, Switch, Button} from 'antd';
import styles from './index.module.scss'
import classNames from "classnames";
import {FC, useEffect, useRef, useState} from "react";
import {useThrottleFn} from "ahooks";
import {EmitParamValueTable, ParamValueTable} from "../../components";


export interface ConditionPanelIProps {
  onChange: (value: EmitValue) => void;
  value: EmitValue
}

export interface EmitValueConfig {
  relation: 'OR' | 'AND'
  value?: EmitParamValueTable[];
  conditions?: EmitValueConfig[]
}

export interface EmitValue {
  value: EmitValueConfig;
  onFailureConfig: {
    continueOnFailure: boolean;
  }
  name: string;

}
export const ConditionPanel: FC<ConditionPanelIProps> = (props: ConditionPanelIProps = {} as ConditionPanelIProps) => {
  const { value, onChange} = props;
  const { name = ''} = value || {};

  const [conditionParams, setConditionParams] = useState<EmitParamValueTable[][]>(() => {
    const list = value?.value?.conditions || [];

    return list?.map(item => {
      return item.value || []
    })
  })

  // 节点name
  const [nodeName, setNodeName] = useState(name);

  const apiId = useRef<any>('');


  const [continueOnFailure, setContinueOnFailure] = useState<boolean>(value?.onFailureConfig?.continueOnFailure || false);

  const reset = () => {

  }
  const handleDsChange = (e: any, runner: (...args: any) => any) => {
    runner( e.target.value);
    reset();
    apiId.current = e.target.value;
    // handleChange();
  }

  const { run: updateValue} = useThrottleFn((value: EmitValue) => {
    onChange(value);
  }, {
    wait: 500
  })

  useEffect(() => {
    const value: EmitValueConfig =  {
      relation: 'OR',
      conditions: conditionParams.map(item => {
        return {
          relation: 'AND',
          conditions: [],
          value: item
        }
      }),
      value: []
    }

    const emitValue: EmitValue = {
      value: value,
      onFailureConfig: {
        continueOnFailure,
      },
      name: nodeName
    }

    console.log(emitValue)
    updateValue(emitValue)
  }, [continueOnFailure, nodeName, conditionParams]);


  return (
    <div className={styles.panelContainer}>
      <div className={styles['setter-title']}>设置名称</div>
      <div className={styles['ds-panel-wrapper']}>
        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-al-center'])}>
          <div className={styles['ds-label']}>节点名称:</div>
          <Input value={nodeName} placeholder="请输入" size="middle"
                 onChange={(e) => handleDsChange(e, setNodeName)}></Input>
        </div>
      </div>

      <div className={styles['setter-title']}>设置条件</div>
      {
        conditionParams.map((item, index) => {
          return (
            <div className={styles['ds-panel-wrapper']} key={index}>
              <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-vertical'])} >
                <div className={styles['ds-label']}>条件{index + 1}： <Button type="link" onClick={() => {
                  const newList = [...conditionParams];
                  newList.splice(index, 1);
                  setConditionParams(newList)
                }}>删除</Button></div>
                <ParamValueTable value={item} onChange={(e) => {
                  const newList = [...conditionParams];
                  newList[index] = e;
                  setConditionParams(newList)
                }}></ParamValueTable>
              </div>
            </div>
          )
        })
      }
      <div className={styles['ds-panel-wrapper']}>
        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-vertical'])} >
          <Button type="dashed" block={true} onClick={() => {
            const list = [...conditionParams];
            list.push([]);
            setConditionParams(list)
          }}>添加或关系</Button>
        </div>
      </div>
      <div className={styles['setter-title']}>其他配置</div>
      <div className={styles['ds-panel-wrapper']}>
        <div
          className={classNames(styles['panel-item'], styles['item-wrap-al-center'], styles['item-wrap-vertical'], styles['item-wrap'])}>
          <div className={styles['ds-label']}>失败配置：</div>
          <div>
            当逻辑失败时，是否继续执行后续逻辑 &nbsp; &nbsp;
            <Switch value={continueOnFailure} onChange={(e) => {
              setContinueOnFailure(e);
            }}></Switch>
          </div>

        </div>

      </div>
    </div>
  )
}

export default {
  component: ConditionPanel,
  type: 'Condition'
}

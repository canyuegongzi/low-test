import { Input, Switch} from 'antd';
import styles from './index.module.scss'
import classNames from "classnames";
import {FC, useEffect, useRef, useState} from "react";
import {useThrottleFn} from "ahooks";
import {EmitParamValueTable, UpdateStateValue} from "../../components/update-state-value";


export interface ConditionPanelIProps {
  onChange: (value: EmitValue) => void;
  value: EmitValue
}

export interface EmitValueConfig {
  relation: 'OR' | 'AND'
  value?: EmitParamValueTable[];
}

export interface EmitValue {
  value: EmitParamValueTable[];
  onFailureConfig: {
    continueOnFailure: boolean;
  }
  name: string;

}
export const UpdateStatePanel: FC<ConditionPanelIProps> = (props: ConditionPanelIProps = {} as ConditionPanelIProps) => {
  const { value, onChange} = props;
  const { name = ''} = value || {};

  const [conditionParams, setConditionParams] = useState<EmitParamValueTable[]>(() => {
    return value?.value || []
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

    const emitValue: EmitValue = {
      value: conditionParams,
      onFailureConfig: {
        continueOnFailure,
      },
      name: nodeName
    }

    console.log(emitValue)
    updateValue(emitValue)
  }, [continueOnFailure,nodeName, conditionParams]);


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

      <div className={styles['setter-title']}>设置数据</div>
      <div className={styles['ds-panel-wrapper']}>
        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-vertical'])}>
          <UpdateStateValue value={conditionParams} onChange={(e) => {
            const newList = [...e];
            setConditionParams(newList)
          }} />
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
  component: UpdateStatePanel,
  type: 'UpdateState'
}

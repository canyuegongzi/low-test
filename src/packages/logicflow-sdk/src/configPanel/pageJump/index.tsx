import {Input, Radio, Switch} from 'antd';
import styles from './index.module.scss'
import classNames from "classnames";
import {FC, useEffect, useRef, useState} from "react";
import {EmitParamCollectorValue, ParamCollector} from "../../components/param-collector";
import {useThrottleFn} from "ahooks";


export interface PageJumpPanelIProps {
  onChange: (value: EmitValue) => void;
  value: EmitValue
}

type JumpType = 'suda' | 'custom'
type Target = '_self' | '_blank'
type System = 'current' | 'other'

export const JumpTypeList: {value: JumpType; label: string}[] = [
  {
    value: 'suda',
    label: '配置页面'
  },
  {
    value: 'custom',
    label: '自定义页面'
  }
]

const TargetList: {value: Target; label: string}[]  = [
  {
    value: '_self',
    label: '当前页面'
  },
  {
    value: '_blank',
    label: '打开新 Tab'
  }
]
const SystemList: {value: System; label: string}[]  = [
  {
    value: 'current',
    label: '宿主系统'
  },
  {
    value: 'other',
    label: '其他'
  }
]

export interface EmitValueConfig {
  jumpType: JumpType; // 目标系统
  target: Target; // 页面打开方式
  customUrl?: string; // 目标页面
  path?: string; // 页面路由
  formKey?: string; // 目标页面
  routeParams? : EmitParamCollectorValue[]
}

export interface EmitValue {
  value: EmitValueConfig;
  onFailureConfig: {
    continueOnFailure: boolean;
  }
  name: string;

}
export const PageJumpPanel: FC<PageJumpPanelIProps> = (props: PageJumpPanelIProps = {} as PageJumpPanelIProps) => {
  const { value, onChange} = props;
  const { name = ''} = value || {};

  const [routeParams, setRouteParams] = useState<EmitParamCollectorValue[]>(value?.value?.routeParams || [])

  // @ts-ignore
  const [jumpType, setJumpType] = useState<JumpType>('custom')
  const [target, setTarget] = useState<Target>('_blank')
  const [system, setSystem] = useState<System>('current')
  const [customUrl, setCustomUrl] = useState<string>('')
  // @ts-ignore
  const [formKey, setFormKey] = useState<string>('')

  // 节点name
  const [nodeName, setNodeName] = useState(name);

  const apiId = useRef<any>('');


  // @ts-ignore
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
    const value: EmitValueConfig = {
      jumpType: jumpType,
      target: target,
      customUrl: customUrl,
      path: '',
      formKey: formKey,
      routeParams: routeParams

    }
    updateValue({
      value: value,
      onFailureConfig: {
        continueOnFailure: continueOnFailure
      },
      name: nodeName
    });


  }, [continueOnFailure, customUrl, formKey, jumpType, nodeName, routeParams, target]);


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

      <div className={styles['setter-title']}>设置跳转</div>
      <div className={styles['ds-panel-wrapper']}>
        {/*<div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-al-center'])}>
          <div className={styles['ds-label']}>页面跳转类型：</div>
          <Radio.Group onChange={(e) => handleDsChange(e, setJumpType)} value={jumpType}>
            {
              JumpTypeList.map(item => {
                return <Radio value={item.value} key={item.value}>{item.label}</Radio>
              })
            }
          </Radio.Group>
        </div>*/}

        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-al-center'])}>
          <div className={styles['ds-label']}>页面打开方式：</div>
          <Radio.Group onChange={(e) => handleDsChange(e, setTarget)} value={target}>
            {
              TargetList.map(item => {
                return <Radio value={item.value} key={item.value}>{item.label}</Radio>
              })
            }
          </Radio.Group>
        </div>

        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-al-center'])}>
          <div className={styles['ds-label']}>目标系统：</div>
          <Radio.Group onChange={(e) => handleDsChange(e, setSystem)} value={system}>
            {
              SystemList.map(item => {
                return <Radio value={item.value} key={item.value}>{item.label}</Radio>
              })
            }
          </Radio.Group>
        </div>

        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-al-center'])}>
          <div className={styles['ds-label']}>目标页面：</div>
          <Input value={customUrl}
                 placeholder={system === 'other' ? "请输入目标页面，例如：'https://i.xiaojukeji.com?q=xxx&t=yyy'" : "请输入目标页面系统路径，例如：'path1/path2/path3'"}
                 size="middle"
                 onChange={(e) => handleDsChange(e, setCustomUrl)}></Input>
        </div>

        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-vertical'])}>
          <div className={styles['ds-label']}>路由参数：</div>
          <ParamCollector value={routeParams} onChange={(e) => {
            setRouteParams(e);
          }}></ParamCollector>
        </div>

        {/*<div
          className={classNames(styles['panel-item'], styles['item-wrap-al-center'], styles['item-wrap-vertical'], styles['item-wrap'])}>
          <div className={styles['ds-label']}>请求失败配置：</div>
          <div>
            当逻辑失败时，是否继续执行后续逻辑 &nbsp; &nbsp;
            <Switch value={continueOnFailure} onChange={(e) => {
              setContinueOnFailure(e);
            }}></Switch>
          </div>

        </div>*/}

      </div>

      <div className={styles['setter-title']}>其他配置</div>
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
  )
}

export default {
  component: PageJumpPanel,
  type: 'PageJump'
}

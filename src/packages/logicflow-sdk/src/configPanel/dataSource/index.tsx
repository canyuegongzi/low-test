import { Input, Modal, Radio, RadioChangeEvent, Select, Switch, Tabs} from 'antd';
import styles from './index.module.scss'
import classNames from "classnames";
import {FC, useEffect, useRef, useState} from "react";
import {EmitParamCollectorValue, NormalValueType, ParamCollector} from "../../components/param-collector";
import {useThrottleFn} from "ahooks";
import {utils} from "@lowcode-set-up-platform/editor";


export interface DataSourcePanelIProps {
  onChange: (value: EmitValue) => void;
  value: EmitValue
}

type FetchModeType = 'direct' | 'redirect' | 'custom';
type ActiveType = 'query' | 'body';
type FetchMethodType = 'GET' | 'POST';

export const requestMethodMap: {value: FetchMethodType, label: FetchMethodType}[] = [
  {
    value: 'GET',
    label: 'GET'
  },
  {
    value: 'POST',
    label: 'POST'
  }
]


interface FetchModeTypeItem {
  value: FetchModeType;
  label: string
}

export interface EmitValueConfig {
  requestName: string;
  requestMethod: FetchMethodType,
  requestUrl: string;
  paramsList: EmitParamCollectorValue[];
  bodyList: EmitParamCollectorValue[];
  dataFetchMode: FetchModeType;
}

export interface EmitValue {
  value: EmitValueConfig;
  onFailureConfig: {
    continueOnFailure: boolean;
  }
  name: string;

}
export const DataSourcePanel: FC<DataSourcePanelIProps> = (props: DataSourcePanelIProps = {} as DataSourcePanelIProps) => {
  const { value, onChange} = props;
  const { name = ''} = value || {};

  const [dataSourceTypeItems, _setDataSourceTypeItems] = useState<FetchModeTypeItem[]>([
    {
      value: 'direct',
      label: '宿主系统'
    },
    {
      value: 'redirect',
      label: '资源引擎'
    },
    {
      value: 'custom',
      label: '自定义'
    }
  ])

  const [dataFetchMode, setDataFetchMode] = useState<FetchModeType>(value?.value?.dataFetchMode || 'custom');
  const [activeType, setActiveType] = useState<ActiveType>('query');

  //请求接口名称
  const [requestName, setRequestName] = useState(value?.value?.requestName || '');
  // 节点name
  const [nodeName, setNodeName] = useState(name);
  //请求接口地址
  const [requestUrl, setRequestUrl] = useState(value?.value?.requestUrl || '');
  //请求方法
  const [requestMethod, setRequestMethod] = useState<FetchMethodType>(value?.value?.requestMethod || 'GET');

  const apiId = useRef<any>('');

  const [paramsList, setParamsList] = useState<EmitParamCollectorValue[]>(value?.value?.paramsList || [])
  const [bodyList, setBodyList] = useState<EmitParamCollectorValue[]>(value?.value?.bodyList || [])

  const [continueOnFailure, setContinueOnFailure] = useState<boolean>(value?.onFailureConfig?.continueOnFailure || false);

  const [curlModal, setCurlModal] = useState<boolean>(false);
  const [curlModalUrl, setCurlModalUrl] = useState<string>('curl \'http://47.98.139.207/lowcode-center-server/v1.0/page/version\' \\\n' +
    '  -H \'Accept: application/json, text/plain, */*\' \\\n' +
    '  -H \'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7\' \\\n' +
    '  -H \'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJVU0VSX0NFTlRFUl9TRVJWRVIiLCJzdWIiOjI1LCJ1c2VyTmFtZSI6ImdwdC1hZG1pbiIsInVzZXJJZCI6MjUsInJvbGVJZCI6W10sInJvbGVDb2RlIjpbIlJPT1RfQURNSU4iXSwidXNlckNvZGUiOiJvYzRrWDQ4Y01oc1dxU1ROcGswWV9BIiwia2V5IjoidXNlcl9jZW50ZXIiLCJpYXQiOjE3Mjc2NjA3ODgsImV4cCI6MTcyNzczMjc4OH0.Nw6VeNubBR0AzbhTZSGaa3Qaod_XSvbz1afBkCdv7qg\' \\\n' +
    '  -H \'Connection: keep-alive\' \\\n' +
    '  -H \'Content-Type: application/json\' \\\n' +
    '  -H \'DNT: 1\' \\\n' +
    '  -H \'Origin: http://47.98.139.207\' \\\n' +
    '  -H \'Referer: http://47.98.139.207/lowcode-center-web/\' \\\n' +
    '  -H \'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36\' \\\n' +
    '  -H \'atom-token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImdwdC1hZG1pbiIsInVzZXJJZCI6MjUsInJvbGVJZCI6W251bGxdLCJ1c2VyQ29kZSI6Im9jNGtYNDhjTWhzV3FTVE5wazBZX0EiLCJpc0F0b20iOnRydWUsImlhdCI6MTcxODg1MzYwMX0.ciH9QTlWG7J9x7GkBauJW8fE8P9oZucNox944bFI25E\' \\\n' +
    '  --data-raw \'{"id":"57","committer":"","version":"","status":"","env":"","page":1,"pageSize":10}\' \\\n' +
    '  --insecure');

  const onDataFetchModeChange = (e: RadioChangeEvent) => {
    setDataFetchMode(e.target.value);
  }

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
    const value = {
      requestName: requestName,
      requestMethod: requestMethod,
      requestUrl: requestUrl,
      paramsList: paramsList,
      bodyList: bodyList,
      dataFetchMode: dataFetchMode
    }
    updateValue({
      value: value,
      onFailureConfig: {
        continueOnFailure: continueOnFailure
      },
      name: nodeName
    });


  }, [paramsList, requestName, requestMethod, requestUrl, dataFetchMode, nodeName, continueOnFailure, bodyList, updateValue]);

  const curlRequest = () => {
    console.log("导入")
    setCurlModal(true)
  }
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

      <div className={styles['setter-title']}>设置请求</div>
      <div className={styles['ds-panel-wrapper']}>
        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-al-center'])}>
          <div className={styles['ds-label']}>请求来源：</div>
          <Radio.Group onChange={onDataFetchModeChange} value={dataFetchMode}>
            {
              dataSourceTypeItems.map(item => {
                return <Radio value={item.value} key={item.value}>{item.label}</Radio>
              })
            }
          </Radio.Group>
        </div>
        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['importCurl'])}
             onClick={curlRequest}>从cURL语句导入
        </div>
        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-al-center'])}>
          <div className={styles['ds-label']}>请求接口名称：</div>
          <Input value={requestName} placeholder="请输入" size="middle"
                 onChange={(e) => handleDsChange(e, setRequestName)}></Input>
        </div>

        <div className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-al-center'])}>
          <div className={styles['ds-label']}>请求接口地址：</div>
          <Input value={requestUrl} placeholder="请输入" size="middle"
                 onChange={(e) => handleDsChange(e, setRequestUrl)}></Input>
        </div>

        <div
          className={classNames(styles['panel-item'], styles['item-wrap'], styles['item-wrap-al-center'], styles['item-wrap-flex-1'])}>
          <div className={styles['ds-label']}>请求方法：</div>

          <Select className={classNames(styles['item-wrap-flex-1'])} options={requestMethodMap} value={requestMethod}
                  onChange={(e) => handleDsChange(e, setRequestMethod)} placeholder="请选择" size="middle"
                  getPopupContainer={(triggerNode) => {
                    return triggerNode.parentNode
                  }}>
          </Select>
        </div>

        <div className={classNames(styles['item-wrap'])}>
          <div className={styles['ds-label']}>请求参数配置：</div>
          <Tabs defaultActiveKey={activeType} size={'small'} items={[
            {
              key: 'query',
              label: 'Query',
              children: (
                <>
                  <ParamCollector value={paramsList} onChange={(e) => {
                    setParamsList(e);
                  }}></ParamCollector>
                </>
              ),
            },
            {
              key: 'body',
              label: 'Body',
              children: (
                <>
                  <ParamCollector value={bodyList} onChange={(e) => {
                    setBodyList(e);
                  }}></ParamCollector>
                </>
              ),
            },
          ]} onChange={(e) => {
            setActiveType(e as ActiveType)
          }}/>

        </div>

        {/*<div
          className={classNames(styles['panel-item'], styles['item-wrap-al-center'], styles['item-wrap-vertical'], styles['item-wrap'])}>
          <div className={styles['ds-label']}>请求失败配置：</div>
          <div>
            当请求失败时，是否继续执行后续逻辑 &nbsp; &nbsp;
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

      <Modal title="cURL语句导入" getContainer={() => document.querySelector(`.${styles.panelContainer}`)!}
             open={curlModal} onOk={() => {
        setCurlModal(false)
        const url = curlModalUrl;
        const result = utils.parseCurl(url);
        console.log(url, result);

        const body = result.body;
        const bodyList: EmitParamCollectorValue[] = [];

        Object.keys(body).forEach(item => {
          const type = typeof body[item];
          bodyList.push({
            key: item,
            value: {
              valueType: 'input',
              type: type as NormalValueType,
              value: body[item]
            }

          })
        })

        setBodyList(bodyList)

        console.log(bodyList)

        setRequestMethod(result.method as FetchMethodType);
        setRequestUrl(result.url);
        setRequestName('接口');
        setCurlModalUrl('')
      }} onCancel={() => {
        setCurlModalUrl('')
        setCurlModal(false)
      }}>
        <Input.TextArea rows={8} value={curlModalUrl} onChange={(e) => {
          setCurlModalUrl(e.target.value as string);
        }}/>
      </Modal>


    </div>
  )
}

export default {
  component: DataSourcePanel,
  type: 'DataSource'
}

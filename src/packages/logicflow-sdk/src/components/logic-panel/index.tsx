import React, {FC, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import '@logicflow/core/dist/index.css';
import '@logicflow/extension/lib/style/index.css';
import FlowCore, {LFReactPortalProvider} from "../../core/FlowCore.tsx";
import styles from './index.module.scss'
import CoreContext from "../../context/core.ts";
import {BaseNodeModel, LogicFlow} from "@logicflow/core";
import GraphData = LogicFlow.GraphData;
import {Control} from "../control";
import {NodeListPanel} from "../node-list-panel";
import {LogicPanelConfig} from "../../core/types.ts";
import {ConfigProvider, Drawer} from "antd";

interface LogicPanelProps {
    style?: React.CSSProperties;
    graphData?: GraphData;
    config: LogicPanelConfig;
    viewAuth?: {
      nodeList: boolean;
      toolsControl: boolean;
    }
    ref?: any;
    renderRefInstance?: any;
}

export interface LogicPanelImperativeHandle {
  getFlowCore: () => FlowCore
}

export const LogicPanel: FC<LogicPanelProps> = forwardRef((props, ref) => {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const container = useRef<HTMLDivElement>(null)
  const [lf, setLf] = useState<LogicFlow>();
  const [flowCore, setFlowCore] = useState<FlowCore>();
  // @ts-ignore
  const [value, setValue] = useState({
    "value": {
      "requestName": "swde",
      "requestMethod": "GET",
      "requestUrl": "dededededede",
      "paramsList": [
        {
          "key": "34406",
          "value": {
            "valueType": "input",
            "value": "hhh",
            "type": "string"
          }
        },
        {
          "key": "272544",
          "value": {
            "valueType": "input",
            "value": "hhhhhh",
            "type": "string"
          }
        },
        {
          "key": "125302",
          "value": {
            "valueType": "input",
            "value": "hhh",
            "type": "string"
          }
        }
      ],
      "bodyList": [
        {
          "key": "34406",
          "value": {
            "valueType": "input",
            "value": "hhh",
            "type": "string"
          }
        },
        {
          "key": "272544",
          "value": {
            "valueType": "input",
            "value": "hhhhhh",
            "type": "string"
          }
        },
        {
          "key": "125302",
          "value": {
            "valueType": "input",
            "value": "hhh",
            "type": "string"
          }
        }
      ],
      "dataFetchMode": "custom"
    },
    "onFailureConfig": {
      "continueOnFailure": false
    },
    "name": "rrrrrrrrr"
  })

  const [selectNode, setSelectNode] = useState<BaseNodeModel<LogicFlow.PropertiesType>>()

  useEffect(() => {
    const nodeClick = (e: { data: BaseNodeModel<LogicFlow.PropertiesType>} | any) => {
      console.log(e.data);
      setSelectNode(e.data);
    }

    const canvasClick = (_e: any) => {
      setSelectNode(null as any);
    }
    if (container.current) {
      const coreFlow = new FlowCore();
      coreFlow.init(container.current);
      const lf = coreFlow.lf;
      setLf(lf);
      setFlowCore(coreFlow)
      if (props.graphData) {
        lf?.render?.(props.graphData)
        //lf.focusOn(this.props.graphData.nodes[0].id)
        lf.translateCenter();
      }
      lf.on('node:click', nodeClick)
      lf.on('blank:click', canvasClick)
    }
    () => {
      lf?.off?.('node:click', nodeClick);
      lf?.off?.('node:click', canvasClick);
      timer?.current && clearTimeout(timer.current);
    };
  }, [])

  const ConfigPanel = useMemo<any>(() => {
    const type = selectNode?.properties?.__config__?.aliasType;
    if (type) {
      const Component = flowCore?.configuration.getConfiguration(type);
      if (Component) {
        return (props: any = {}) => {
          const value = Object.assign({}, props.value || {}, {
            name: selectNode?.properties?.label,
            ...(selectNode?.properties?.biz || {})
          })
          return (
            <Component {...props} value={value}></Component>
          )
        }
      }
      return null;
    }
    return null;
  }, [selectNode])

  useImperativeHandle(ref, (): LogicPanelImperativeHandle => {
    return {
      getFlowCore(): FlowCore {
        return flowCore!;
      }

    }
  })

  return (
    <div className={styles.container}>
      <CoreContext.Provider value={{
        lf: lf,
        flowCore: flowCore,
        renderRefInstance: props?.renderRefInstance,
        ...props.config
      }}>
        <LFReactPortalProvider />
        {
          props?.viewAuth?.toolsControl && (
            <Control flowCore={flowCore!}></Control>
          )
        }
        {
          props?.viewAuth?.nodeList && (
            <NodeListPanel flowCore={flowCore!}></NodeListPanel>
          )
        }
        <div className={styles.examplePanel}>
        </div>
        <Drawer
          mask={false}
          styles={{
            header: {
              display: "none"
            },
            body: {
              padding: 8
            }
          }}
          title="Basic Drawer"
          className={styles.drawer}
          onClose={() => {
            setSelectNode(null as any);
          }}
          width={490}
          open={!!ConfigPanel}>
          {
            ConfigPanel && (
              <ConfigProvider  theme={{
                components: {
                  Select: {
                    optionPadding: '4px 2px'
                    /* 这里是你的组件 token */
                  },
                  Table: {
                    cellPaddingInlineMD: 4,
                    // cellPaddingBlockMD: 4,
                    headerBorderRadius: 4
                  }
                },
              }}>
                <ConfigPanel
                  onChange={(value: any) => {
                    setValue(value)
                    if (selectNode?.id) {
                      const model = flowCore?.lf?.getNodeModelById(selectNode.id!)
                      model?.setProperties?.({
                        biz: value,
                        label: value?.name || model?.properties?.label
                      })
                    }

                  }}
                />
              </ConfigProvider>
            )
          }
        </Drawer>
      </CoreContext.Provider>
      <div ref={container} id="graph" className={styles.content}></div>

    </div>
  );

})

import {BaseNodeModel, LogicFlow} from "@logicflow/core";
import {JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState} from "react";
import {commonNodeMap} from "../../nodes/config.ts";
import Context from "../../context";
import {Menu} from "antd";
import styles from './index.module.scss'
import Popover from "../../plugin/popover/popover.ts";
import {NormalNodeItemProperties} from "../../core/types.ts";


export interface InsertProperties {
  name: string;
  logo: string;
  __nodeType__: string;
  __nodeAction__?: string;
  [key: string]: any
}
export interface InsertCommonNodeData {
  type: string;
  properties: NormalNodeItemProperties;
  callback?: () => void;
  model?: BaseNodeModel<LogicFlow.PropertiesType>
}
export interface IProps {
  lf: LogicFlow;
  show?: boolean;
  context: Context;
  graph: any;
  model: BaseNodeModel<LogicFlow.PropertiesType>;
  position?: any;
  showConnectBlock: any
  __id: any;

  insertCommonNode: (currentModel: InsertCommonNodeData) => void
}

const InsertNodeMenu = (props: IProps) => {
  const {lf, graph, model, showConnectBlock, __id, insertCommonNode} = props;
  const [nodeOptions, setNodeOptions] = useState<any[]>([]);

  useEffect(() => {
    const updateNodeOptions = () => {
      setNodeOptions([]);
    };
    updateNodeOptions();
  }, [lf, setNodeOptions]);

  const handleNodeEnter = (_value: string) => {};

  const addCommonNode = (selectedKeys: any) => {
    const key = selectedKeys.key;
    const defaultConfig = Object.values(commonNodeMap).find(item => {
      return item.value === key
    });
    if (defaultConfig) {
      const config: InsertCommonNodeData = {
        type: defaultConfig.__config__.type,
        properties: {
          ...defaultConfig,
          logo: defaultConfig.label,
        },
        callback: () => {
          const popover: Popover = lf.extension.popover as Popover;
          popover.hide(__id)
        }
      }
      if (model) {
        config.model = model;
      }

      insertCommonNode?.(config)
    }
  };

  const connectToNode = (selectedKeys: any) => {
    const key = selectedKeys.key;
    graph.connectToNode(key, model);
  };

  return (
    <div className={styles['node-menu-wrapper']}>
      <div className={styles['node-add-title']}>通用节点:</div>
      <div style={{textAlign: 'right', margin: 0}}>
        <Menu
          className={styles['node-menu']}
          mode="vertical"
          onSelect={addCommonNode}
          items={Object.values(commonNodeMap).map((item: {
            [key: string]: any;
            logo: string | undefined;
            label: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
          }, _index: any) => ({
            key: item.value,
            label: (
              <span className={styles['menu-item-inner']}>
                <img src={item.logo} alt="" className={styles['icon']} />
                {item.label}
              </span>
            )
          }))}
        />
      </div>
      <div className={styles['split-line']} style={showConnectBlock && nodeOptions.length ? {} : {display: 'none'}}/>
      <div className={styles['node-add-title']} style={showConnectBlock && nodeOptions.length ? {} : {display: 'none'}}>连接至已有节点:</div>
      <div style={{textAlign: 'right', margin: 0, display: showConnectBlock && nodeOptions.length ? 'block' : 'none'}}>
        <Menu
          className={styles['node-menu']}
          mode="vertical"
          onSelect={connectToNode}
          items={nodeOptions.map((item, index) => ({
            key: index,
            config: item,
            label: (
              <span className={styles['menu-item-inner']} onMouseEnter={() => handleNodeEnter(item.value)}>
                <img src={item.logo} alt="" className={styles['icon']} />
                {item.label}
              </span>
            )
          }))}
        />
      </div>
    </div>
  );
};

export default InsertNodeMenu;

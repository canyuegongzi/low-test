import {ReactNodeProps} from "@logicflow/react-node-registry";
import {FC} from "react";
import styles from './index.module.scss'
import classNames from "classnames";
import BaseNodeModel from "./model.ts";
import {Popconfirm, Popover, Tooltip} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import {useDebounceFn} from "ahooks";
import {AbstractContent} from "../../../components";
//import {View} from "./view.ts";

export const BaseNode: FC<ReactNodeProps> = (props) => {
  const { node: model, graph,  }= props;

  const properties = model.properties;

  const handleMousedown = () => {

  }

  const handleMouseup = () => {

  }

  const getLogo = () => {
    return 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png';
  }

  const getName = () => {
    return properties.label || properties.name;
  }

  const selectNode = () => {
    graph.eventCenter.emit(`node:update-model`, model)
  }

  const copyNode  = () => {
    graph.eventCenter.emit(`node:copy-node`, model)
  }

  const deleteNode = () => {
    graph.eventCenter.emit(`node:delete-node`, model)
  }

  const getAbstract = () => {
    return (model.getNodeAbstract && model.getNodeAbstract()) || {}
  }
  const goConfig = () => {
    graph.eventCenter.emit(`node:select-click`, model)
  }

  const handleNext = (e: MouseEvent | any) => {
    e.stopPropagation();
    const nodeX = model.x
    const nodeY = model.y
    const x = nodeX + model.width / 2
    const y = nodeY
    const popoverItemKey = graph.popover.show({
      type: 'tip',
      key: model.id,
      delay: 100,
      placement: 'right',
      trigger: 'click',
      width: 16,
      height: 16,
      x,
      y,
      props: {
        showConnectBlock: true
      }
    })

    console.log(popoverItemKey)

  }

  const highHeightNode = model.properties.status === 'selected' || model.properties.status === 'hovered' || model.isHovered  || model.isSelected;
  const { run: onMouseOverFun } = useDebounceFn(
    (e) => {
      e.stopPropagation()
      graph.eventCenter.emit(`node:hover-node`, model)
    },
    { wait: 100 },
  );


  const { run: onMouseLeaveFun } = useDebounceFn(
    (e) => {
      e.stopPropagation()
      graph.eventCenter.emit(`node:cancel-hover-node`, model)
    },
    { wait: 100 },
  );

  return (
    <div className={classNames({
      [styles['node-wrap']]: true,
      [styles['base']]: true,
      [properties.status]: !!properties.status,
      [properties.executeStatus]: !!properties.executeStatus,
    })}
         onMouseEnter={onMouseOverFun}
         onMouseLeave={onMouseLeaveFun}
    >
      <div className={styles['node-title']} onMouseDown={handleMousedown} onMouseUp={handleMouseup} >
        <span className={styles['node-icon']}>
          <img src={getLogo()} alt=""/>
        </span>
        <span className={styles['node-name']}>{getName()}</span>
      </div>
      {
        highHeightNode && (
          <div className={styles['node-option']} onMouseDown={selectNode}>
            <Tooltip title="复制节点" className={styles['item']}>
              <span className={styles['option-icon']} onClick={copyNode} onMouseDown={() => {}}>
                <img src="https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/node_copy.png" alt={''}/>
              </span>
            </Tooltip>
            <Tooltip title="信息概览" className={styles['item']}>
              <Popover
                overlayInnerStyle={{minWidth: 188, minHeight: 100, padding: 8}}
                content={<AbstractContent
                  title={getAbstract().title}
                  content={getAbstract().content}
                  showButton={getAbstract().showButton}
                  goConfig={goConfig}
                />} trigger={'click'}>
                <span className={styles['option-icon']} onClick={() => {}} onMouseDown={() => {
                  }}>
                  <img src="https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/node_abstract.png"
                       alt={''}/>
                </span>
              </Popover>
            </Tooltip>
            <Tooltip title="删除节点" className={styles['item']}>
              <Popconfirm
                title=""
                description="确认删除该节点吗？"
                onConfirm={deleteNode}
                onCancel={() => {
                }}
                okText="确认"
                cancelText="取消"
              >
                <span className={styles['option-icon']} onMouseDown={() => {}}>
                  <img src="https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/node_delete.png" alt={''}/>
                </span>
              </Popconfirm>
            </Tooltip>
          </div>
        )
      }
      <div className={styles['node-next']}>
        {
          highHeightNode && (
            <PlusCircleOutlined onMouseDown={handleNext} className={styles['next-icon']}/>
          )
        }
      </div>
    </div>
  );
};

export default {
  type: 'BaseNode',
  // view: View,
  component: BaseNode,
  model: BaseNodeModel
}

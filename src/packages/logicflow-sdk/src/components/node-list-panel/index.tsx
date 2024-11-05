import React, {useContext, useEffect, useRef} from "react";
import FlowCore from "../../core/FlowCore.tsx";
import styles from './index.module.scss'
import {Collapse, CollapseProps, Tooltip, Tree} from "antd";
import CoreContext from "../../context/core.ts";
import {PageLifeCycleNodeItem} from "../../core/types.ts";
import {genId} from "../../utils/calculate.ts";
import {ComponentDSL} from "@lowcode-set-up-platform/dsl";
import {CaretRightOutlined} from "@ant-design/icons";


interface IProps {
  flowCore: FlowCore;
}

const MemoTooltip = Tooltip || React.memo(Tooltip);
export const NodeListPanel = (props: IProps) => {
  const { pageLifeCycleNodes  = [], componentsTree = [], stateNodes = [], pageUtilsNodes = [], conditionUtilsNodes = [], defaultConfig = {
    start: {
      label: '组件',
      value: 'ComponentNode',
      logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png',
      __config__: {
        type: 'StartNode',
        aliasType: 'ComponentNode'
      }
    }
  } } = useContext(CoreContext);

  const dragRow = useRef<PageLifeCycleNodeItem>();
  const randomNum = useRef<string>();

  const onMouseDown = (_e: any, data: PageLifeCycleNodeItem) => {
    randomNum.current = genId(10)
    dragRow.current = data as any;

    props.flowCore.lf.dnd.startDrag({
      type: data.__config__.type,
      //text: data.label,
      id: randomNum.current,
      properties: {
        ...data,
        name: data.label,
        __config__: {
          ...(data?.__config__ || {}),
          correlationId: data?.__config__.correlationId
        }
      }
    });
  }

  const onComponentNodeMouseDown = (_e: any, data: ComponentDSL) => {
    randomNum.current = genId(10)
    dragRow.current = {
      ...defaultConfig.start,
      label: data.alias,
      __config__: {
        ...(defaultConfig?.start?.__config__ || {}),
        correlationId: data.id
      }
    };
    props.flowCore.lf.dnd.startDrag({
      type: defaultConfig.start.__config__.type,
      id: randomNum.current,
      properties: {
        ...dragRow.current,
        name: data.alias,
      },
      text: ''
    });
  }

  const onMouseUp = (_e: any, _data: PageLifeCycleNodeItem) => {
    props.flowCore.lf.dnd.stopDrag();
  }


  const onComponentNodeMouseUp = (_e: any, _data: ComponentDSL) => {
    props.flowCore.lf.dnd.stopDrag();
  }

  // 停止拖拽时节点可放置的位置
  const allowDrop = () => {
    return false; // 停止拖拽后树节点位置不发生改变
  };

  useEffect(() => {

    const nodeDndAdd = (_e: any) => {
      props.flowCore.lf.dnd.stopDrag();
      if (randomNum.current) {
        /*props.flowCore.lf.setProperties(randomNum.current, {
          ...dragRow.current || {}
        })*/
      }
      randomNum.current = ''
      dragRow.current = {} as any
    }


    if (props?.flowCore?.lf) {
      props?.flowCore?.lf?.on?.('node:dnd-add', nodeDndAdd)
      // props?.flowCore?.lf?.on?.('node:dnd-drag', nodeDndDrag)
    }

    return () => {
      props?.flowCore?.lf?.off?.('node:dnd-add', nodeDndAdd)
      // props?.flowCore?.lf?.off?.('node:dnd-drag', nodeDndDrag)
    }
  }, [props?.flowCore?.lf])


  const pageLifeHooksItems: CollapseProps['items'] = [
    {
      key: 'pageLifeHooks',
      label: '页面生命周期',
      children: <Tree
        treeData={pageLifeCycleNodes as any}
        defaultExpandAll
        draggable={false}
        selectable={false}
        allowDrop={allowDrop}
        fieldNames={{
          key: 'value'
        }}
        titleRender={(item) => {
          const title = (item as any).label as React.ReactNode;
          return (
            <div
              onMouseDown={(e) => onMouseDown(e, item as unknown as PageLifeCycleNodeItem)}
              onMouseUp={(e) => onMouseUp(e, item as unknown as PageLifeCycleNodeItem)}
            >
              <MemoTooltip title={title} placement={'right'}>
                <div className={styles['node']}>
                  {/*<span className={styles['node-icon']}>
                    <img src={(item as any).logo} alt=""/>
                  </span>*/}
                  <span className={styles['node-name']}>{title}</span>
                </div>

              </MemoTooltip>
            </div>
          );
        }}
      />,
    },
  ];

  const pageUtilsItems: CollapseProps['items'] = [
    {
      key: 'pageUtilsItems',
      label: '页面交互逻辑',
      children: <Tree
        treeData={pageUtilsNodes as any}
        defaultExpandAll
        draggable={false}
        selectable={false}
        allowDrop={allowDrop}
        fieldNames={{
          key: 'value'
        }}
        titleRender={(item) => {
          const title = (item as any).label as React.ReactNode;
          return (
            <div
              onMouseDown={(e) => onMouseDown(e, item as unknown as PageLifeCycleNodeItem)}
              onMouseUp={(e) => onMouseUp(e, item as unknown as PageLifeCycleNodeItem)}
            >
              <MemoTooltip title={title} placement={'right'}>
                <div className={styles['node']}>
                  {/*<span className={styles['node-icon']}>
                    <img src={(item as any).logo} alt=""/>
                  </span>*/}
                  <span className={styles['node-name']}>{title}</span>
                </div>

              </MemoTooltip>
            </div>
          );
        }}
      />,
    },
  ];

  const conditionUtilsItems: CollapseProps['items'] = [
    {
      key: 'conditionUtilsItems',
      label: '条件交互逻辑',
      children: <Tree
        treeData={conditionUtilsNodes as any}
        defaultExpandAll
        draggable={false}
        selectable={false}
        allowDrop={allowDrop}
        fieldNames={{
          key: 'value'
        }}
        titleRender={(item) => {
          const title = (item as any).label as React.ReactNode;
          return (
            <div
              onMouseDown={(e) => onMouseDown(e, item as unknown as PageLifeCycleNodeItem)}
              onMouseUp={(e) => onMouseUp(e, item as unknown as PageLifeCycleNodeItem)}
            >
              <MemoTooltip title={title} placement={'right'}>
                <div className={styles['node']}>
                  {/*<span className={styles['node-icon']}>
                    <img src={(item as any).logo} alt=""/>
                  </span>*/}
                  <span className={styles['node-name']}>{title}</span>
                </div>

              </MemoTooltip>
            </div>
          );
        }}
      />,
    },
  ];

  const stateItems: CollapseProps['items'] = [
    {
      key: 'stateItems',
      label: '更新操作',
      children: <Tree
        treeData={stateNodes as any}
        defaultExpandAll
        draggable={false}
        selectable={false}
        allowDrop={allowDrop}
        fieldNames={{
          key: 'value'
        }}
        titleRender={(item) => {
          const title = (item as any).label as React.ReactNode;
          return (
            <div
              onMouseDown={(e) => onMouseDown(e, item as unknown as PageLifeCycleNodeItem)}
              onMouseUp={(e) => onMouseUp(e, item as unknown as PageLifeCycleNodeItem)}
            >
              <MemoTooltip title={title} placement={'right'}>
                <div className={styles['node']}>
                  {/*<span className={styles['node-icon']}>
                    <img src={(item as any).logo} alt=""/>
                  </span>*/}
                  <span className={styles['node-name']}>{title}</span>
                </div>

              </MemoTooltip>
            </div>
          );
        }}
      />,
    },
  ];

  const componentsItems: CollapseProps['items'] = [
    {
      key: 'components',
      label: '页面组件树',
      children: <Tree
        treeData={componentsTree}
        defaultExpandAll
        height={300}
        draggable={false}
        selectable={false}
        allowDrop={allowDrop}
        fieldNames={{
          key: 'id'
        }}
        titleRender={(item) => {
          const title = (item as any).alias as React.ReactNode;
          return (
            <div
              onMouseDown={(e) => onComponentNodeMouseDown(e, item as unknown as ComponentDSL)}
              onMouseUp={(e) => onComponentNodeMouseUp(e, item as unknown as ComponentDSL)}
            >
              <MemoTooltip title={title} placement={'right'}>
                <div className={styles['node']}>
                  {/*<span className={styles['node-icon']}>
                    <img src={(item as any).logo} alt=""/>
                  </span>*/}
                  <span className={styles['node-name']}>{title}</span>
                </div>

              </MemoTooltip>
            </div>
          );
        }}
      />,
    },
  ];

  return (
    <div className={styles.nodePanel}>
      <div className={styles.panelTitle}>节点</div>
      <Collapse
        defaultActiveKey={['pageLifeHooks']}
        expandIconPosition={'end'}
        ghost
        items={pageLifeHooksItems}
        className={styles.collapse}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      />

      <Collapse
        defaultActiveKey={['pageUtilsItems']}
        expandIconPosition={'end'}
        ghost
        items={pageUtilsItems}
        className={styles.collapse}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      />
      <Collapse
        defaultActiveKey={['conditionUtilsItems']}
        expandIconPosition={'end'}
        ghost
        items={conditionUtilsItems}
        className={styles.collapse}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      />

      <Collapse
        defaultActiveKey={['stateItems']}
        expandIconPosition={'end'}
        ghost
        items={stateItems}
        className={styles.collapse}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      />

      <Collapse
        defaultActiveKey={['components']}
        expandIconPosition={'end'}
        ghost
        items={componentsItems}
        className={styles.collapse}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      />
    </div>
  )

}

import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Button, Col, Collapse, CollapseProps, Modal, Row, Tooltip, Tree} from 'antd';
import type {DraggableData, DraggableEvent} from 'react-draggable';
import Draggable from 'react-draggable';
import styles from './index.module.scss'
import {CaretRightOutlined, ExclamationCircleOutlined, FullscreenExitOutlined, HolderOutlined} from '@ant-design/icons';
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import MonacoEditor from "@lowcode-set-up-platform/plugin-base-monaco-editor";
import CoreContext from "../../context/core.ts";
import {detectType, isJSExpression, parseData} from "@lowcode-set-up-platform/shared";
import classNames from "classnames";
import ReactJson from 'react-json-view'

interface IProps {
  open?: boolean;
  value?: EmitSelectVariableValue;
  onChange?: OnChange;
  config: {
    self: any
  }
  disableList?: ValueType[]
}

const defaultEditorProps = {
  theme: 'light',
  readOnly: false,
}

const defaultEditorOption = {
  readOnly: false,
  // automaticLayout: true,
  folding: true, // 默认开启折叠代码功能
  wordWrap: 'off',
  formatOnPaste: true,
  fontSize: 13,
  tabSize: 2,
  scrollBeyondLastLine: false,
  fixedOverflowWidgets: false,
  snippetSuggestions: 'top',
  minimap: {
    enabled: false,
  },
  options: {
    readOnly: false,
    folding: true, // 默认开启折叠代码功能
    lineNumbers: 'on',
    fixedOverflowWidgets: true,
    automaticLayout: true,
    glyphMargin: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
    hover: {
      enabled: false,
    },
  },
  scrollbar: {
    horizontal: 'auto',
  },
};

const MemoTooltip = Tooltip || React.memo(Tooltip);

export type ValueType = 'input' | 'pageState' | 'componentProp' | 'routerInfo' | 'systemEnvInfo' | 'flowRunningTime' | string;
export type NormalValueType = 'string' | 'number' | 'boolean' | 'undefined' | 'null' | 'object' | 'array[string]' | 'array[number]' | 'any'

export interface EmitSelectVariableValue {
  valueType: ValueType,
  value: any;
  type: NormalValueType;
}

type OnChange = (value: EmitSelectVariableValue) => any
const SelectVariable: React.FC<IProps> = (props: IProps) => {
  // 值的渲染类型
  const [valueType, setValueType] = useState<ValueType>();
  const { variableProvideConfig } = useContext(CoreContext)
  const { pageStates = [], systemDevice = [], systemRouterParams = [] } = variableProvideConfig || {};
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);

  const [editorCode, setEditorCode] = useState<string>('')

  const [selectedTreeKeys, setSelectedTreeKeys] = useState<string[]>([])
  // const [selectedNodes, setSelectedNodes] = useState<VariableItem[]>([])

  const monacoEditorRef = useRef<any>()

  const topPanelRef = useRef<any>()

  const [editorHeight, setEditorHeight] = useState(0)

  const pageStatesTree = useMemo(() => {
    if (typeof pageStates === 'function') {
      return pageStates()
    }
    return pageStates;
  }, [pageStates])

  const systemDeviceTree = useMemo(() => {
    if (typeof systemDevice === 'function') {
      return systemDevice()
    }
    return systemDevice;
  }, [systemDevice])

  const systemRouterParamsTree = useMemo(() => {
    if (typeof systemRouterParams === 'function') {
      return systemRouterParams()
    }
    return systemRouterParams;
  }, [systemRouterParams])

  const flowRunningTimeTreeItemsTree = useMemo(() => {
    return [
      {
        name: '上节点结果',
        value: 'this.globalData.actionResponse',
        sourceCode: 'this.globalData.actionResponse'
      }
    ]
  }, [])

  useEffect(() => {
    setOpen(!!props?.open)
  }, [props.open])

  const handleOk = (_e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
  };

  const handleCancel = (_e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
  };

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  /**
   * 选中树节点
   */
  const selectTreeNode = (selectedKeys: string[], e: {selected: boolean, selectedNodes: any, node: any, event: any}, valueType: ValueType) => {
    setEditorCode(e.node.sourceCode)
    setSelectedTreeKeys(selectedKeys)
    // setSelectedNodes(e.selectedNodes)
    setValueType(valueType)

  }

  useEffect(() => {
    if (open) {
      setEditorHeight(topPanelRef.current?.clientHeight || editorHeight)
    }
  }, [open]);

  const pageStateItems: CollapseProps['items'] = [
    {
      key: 'pageState',
      label: '页面状态',
      children: <Tree<any>
        treeData={pageStatesTree}
        blockNode
        disabled={props?.disableList?.includes?.('pageState')}
        selectedKeys={selectedTreeKeys}
        onSelect={((selectedKeys: string[], e: {selected: boolean, selectedNodes: any, node: any, event: any}) => selectTreeNode(selectedKeys, e, 'pageState')) as any}
        draggable={false}
        fieldNames={{
          title: 'name',
          key: 'value',
          children: 'children'
        }}
        titleRender={(item) => {
          const title = (item as any).name as React.ReactNode;
          const value = (item as any).value as React.ReactNode;
          return (
            <div>
              <MemoTooltip title={value} placement={'right'}>
                <div className={styles['node']}>
                  <span className={styles['node-name']}>{title}</span>
                </div>

              </MemoTooltip>
            </div>
          );
        }}
      />,
    },
  ];

  const systemDeviceTreeItems: CollapseProps['items'] = [
    {
      key: 'systemEnvInfo',
      label: '系统信息',
      children: <Tree<any>
        treeData={systemDeviceTree}
        disabled={props?.disableList?.includes?.('systemEnvInfo')}
        blockNode
        onSelect={((selectedKeys: string[], e: {selected: boolean, selectedNodes: any, node: any, event: any}) => selectTreeNode(selectedKeys, e, 'systemEnvInfo')) as any}
        draggable={false}
        selectedKeys={selectedTreeKeys}
        fieldNames={{
          title: 'name',
          key: 'value',
          children: 'children'
        }}
        titleRender={(item) => {
          const title = (item as any).name as React.ReactNode;
          const value = (item as any).value as React.ReactNode;
          return (
            <div>
              <MemoTooltip title={value} placement={'right'}>
                <div className={styles['node']}>
                  <span className={styles['node-name']}>{title}</span>
                </div>

              </MemoTooltip>
            </div>
          );
        }}
      />,
    },
  ];

  const systemRouterParamsTreeItems: CollapseProps['items'] = [
    {
      key: 'routerInfo',
      label: '路由信息',
      children: <Tree<any>
        treeData={systemRouterParamsTree}
        disabled={props?.disableList?.includes?.('routerInfo')}
        blockNode
        onSelect={((selectedKeys: string[], e: {selected: boolean, selectedNodes: any, node: any, event: any}) => selectTreeNode(selectedKeys, e, 'routerInfo')) as any}
        selectedKeys={selectedTreeKeys}
        draggable={false}
        fieldNames={{
          title: 'name',
          key: 'value',
          children: 'children'
        }}
        titleRender={(item) => {
          const title = (item as any).name as React.ReactNode;
          const value = (item as any).value as React.ReactNode;
          return (
            <div>
              <MemoTooltip title={value} placement={'right'}>
                <div className={styles['node']}>
                  <span className={styles['node-name']}>{title}</span>
                </div>

              </MemoTooltip>
            </div>
          );
        }}
      />,
    },
  ];


  const flowRunningTimeTreeItems: CollapseProps['items'] = [
    {
      key: 'flowRunningTime',
      label: '编排运行时',
      children: <Tree<any>
        treeData={flowRunningTimeTreeItemsTree}
        disabled={props?.disableList?.includes?.('flowRunningTime')}
        blockNode
        onSelect={((selectedKeys: string[], e: {selected: boolean, selectedNodes: any, node: any, event: any}) => selectTreeNode(selectedKeys, e, 'flowRunningTime')) as any}
        selectedKeys={selectedTreeKeys}
        draggable={false}
        fieldNames={{
          title: 'name',
          key: 'value',
          children: 'children'
        }}
        titleRender={(item) => {
          const title = (item as any).name as React.ReactNode;
          const value = (item as any).value as React.ReactNode;
          return (
            <div>
              <MemoTooltip title={value} placement={'right'}>
                <div className={styles['node']}>
                  <span className={styles['node-name']}>{title}</span>
                </div>

              </MemoTooltip>
            </div>
          );
        }}
      />,
    },
  ];

  const currentValue = useMemo(() => {
    if (selectedTreeKeys && selectedTreeKeys.length) {
      return {
        type: 'JSExpression',
        value: editorCode
      }
    }
    else {
      return editorCode
    }
  }, [selectedTreeKeys, editorCode])

  useEffect(() => {
    if (props?.value) {
      setValueType(props?.value?.valueType || 'input')
      if (isJSExpression(props?.value?.value)) {
        setEditorCode(props?.value?.value?.value);
        setSelectedTreeKeys([props?.value?.value?.value])
      } else {
        setEditorCode(props?.value?.value);
        setSelectedTreeKeys([])
      }
    }
  }, [props?.value]);


  const emitValue = () => {
    const result = {
      type: runCodeResult.type as any,
      value: currentValue,
      valueType: valueType as ValueType
    }
    props?.onChange?.(result);
    console.log("result", result)
  }
  const runCodeResult = useMemo(() => {
    const response = {
      str: '',
      err :'',
      type: ''
    }

    const scope = () => {
      if (typeof props?.config?.self === 'function') {
        return props?.config?.self()
      }
      return props?.config?.self || {};
    }

    if (valueType === 'flowRunningTime') {
      response.str = '运行时数据可任意直接访问';
    }else {
      try {
        response.str = parseData(
          {type: 'JSExpression', value: editorCode},
          scope(),
          {
            thisRequiredInJSE: true,
            errCallback: (err: any) => {
              response.str = '';
              response.err = err.message
            }
          });

        response.type = detectType(response.str)
      }catch (e: any) {
        response.str = '';
        response.err = e.message
      }
    }

    return response;
  }, [editorCode, valueType ])

  return (
    <>
      <Modal
        closable={false}
        width={580}
        wrapClassName={styles['modalContainer']}
        footer={null}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            defaultClassName={styles['modalContainer']}
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <div className={styles['container']}>
          <Row className={styles['popout-header']}>
            <Col
              span={18}
              className={styles['title-view']}
              onMouseOver={() => {
                if (disabled) {
                  setDisabled(false);
                }
              }}
              onMouseOut={() => {
                setDisabled(true);
              }}>
              <HolderOutlined onMouseOver={() => {
                setDisabled(false);
              }}/>
              <span className={styles['span']} onMouseOver={() => {
                setDisabled(false);
              }}>绑定变量</span>
            </Col>
            <Col span={6} className={styles['close-view']}>
              <Tooltip placement="bottom" title={'收起'}>
                <Button size={'small'} type={'primary'} autoInsertSpace={false} onClick={emitValue}><FullscreenExitOutlined />完成</Button>
              </Tooltip>

            </Col>
          </Row>
          <Row className={styles['content']}>
            <Col span={14} className={styles['dataEditor']}>
              <PanelGroup direction="vertical" onLayout={() => {
                setEditorHeight(topPanelRef.current?.clientHeight || editorHeight)
              }}>
                <Panel defaultSize={140} >
                  <div ref={topPanelRef} className={styles['overNormal']}>
                    <MonacoEditor
                      value={editorCode}
                      ref={monacoEditorRef}
                      {...defaultEditorProps}
                      {...defaultEditorOption}
                      {...{ language: 'text' }}
                      onChange={(_newCode: string) => {
                        if (valueType !== 'flowRunningTime') {
                          // setSelectedNodes([]);
                          setSelectedTreeKeys([]);
                          setEditorCode(_newCode)
                          setValueType('input')
                        }
                      }}
                      editorDidMount={() => {}}
                      height={editorHeight}
                    ></MonacoEditor>
                  </div>

                </Panel>
                <PanelResizeHandle className={styles['line-vertical']}/>
                <Panel defaultSize={70}>
                  <div className={classNames(styles['overScroll'], styles['runCodeResult'])}>
                    <div className={styles['resultTip']}></div>
                    {
                      !runCodeResult.err && (
                        <div className={styles['resultType']}>当前运行结果: ({runCodeResult.type})</div>
                      )
                    }
                    {
                    runCodeResult.str && (
                        <div className={styles['resultValue']}>
                          {
                            ['object', 'array'].includes(runCodeResult.type) ? (
                              <ReactJson
                                src={runCodeResult.str as any}
                                theme={'grayscale:inverted'}
                                onEdit={false}
                                enableClipboard={true}
                                onAdd={false}
                                onDelete={false}
                                onSelect={false}
                                indentWidth={1}
                                collapsed={1}
                                displayDataTypes={false}
                                displayObjectSize={false}
                              ></ReactJson>
                            ) : runCodeResult.str
                          }
                        </div>
                      )
                    }
                    {
                      runCodeResult.err && (
                        <p className={styles['resultErrValue']}>
                          <ExclamationCircleOutlined style={{marginRight: 6}} />{
                            runCodeResult.err
                          }
                        </p>
                      )
                    }
                  </div>

                </Panel>
              </PanelGroup>
            </Col>
            <Col span={10} className={styles['dataTreeList']}>
              <Collapse
                defaultActiveKey={['pageState']}
                expandIconPosition={'end'}
                ghost
                items={pageStateItems}
                className={styles.collapse}
                expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
              />

              <Collapse
                defaultActiveKey={['systemEnvInfo']}
                expandIconPosition={'end'}
                ghost
                items={systemDeviceTreeItems}
                className={styles.collapse}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              />

              <Collapse
                defaultActiveKey={['routerInfo']}
                expandIconPosition={'end'}
                ghost
                items={systemRouterParamsTreeItems}
                className={styles.collapse}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              />

              <Collapse
                defaultActiveKey={['flowRunningTime']}
                expandIconPosition={'end'}
                ghost
                items={flowRunningTimeTreeItems}
                className={styles.collapse}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              />
            </Col>
          </Row>
        </div>

      </Modal>
    </>
  );
};

export default SelectVariable;

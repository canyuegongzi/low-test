import { LogicFlow} from "@logicflow/core";
import { register, Portal } from '@logicflow/react-node-registry';
import {
  EventNode,
  ReactionNode,
  CommonNode,
  LogicPolyline, PageInitNode
} from "../nodes";
import { ReactNodeConfig } from "@logicflow/react-node-registry/src/registry.ts";
import {DndPanel, MiniMap, SelectionSelect, Snapshot} from "@logicflow/extension";
import Context from "../context";
import Graph from "./Graph.ts";
import {EDITOR_EVENT} from "../nodes/constant.ts";
import Popover from "../plugin/popover/popover.ts";
import ReactDOM from "react-dom/client";
import React from "react";
import {InsertCommonNodeData, InsertNodeMenu,} from "../components";
import type {IProps as InsertNodeMenuIProps} from "../components/insert-node-menu";
import {StartNode} from "../nodes/lifecycle";
import {Configuration, ConfigurationItem} from "./Configuration.ts";
import  {FlowConfigurationComponentList} from "../configPanel";

export const LFReactPortalProvider = Portal.getProvider(); // 注意，一个 LogicFlow 实例只能生命一个 portal provider

const components: ReactNodeConfig[] | any[] = [
  PageInitNode,
  EventNode,
  ReactionNode,
  LogicPolyline,
  CommonNode,
  StartNode,
]

export const StartNodeConfig = [
  EventNode,
  PageInitNode
]

/*export const ConfigurationList: ConfigurationItem[] = [
  {
    component: FlowConfigurationComponents.DataSourcePanel,
    type: 'DataSource'
  },

  {
    component: FlowConfigurationComponents.PageJumpPanel,
    type: 'PageJump'
  },
  {
    component: FlowConfigurationComponents.PageInitNodePanel,
    type: 'PageInitNode'
  },
  {
    component: FlowConfigurationComponents.PageUnmountNodePanel,
    type: 'PageUnmountNode'
  },

  {
    component: FlowConfigurationComponents.ConditionPanel,
    type: 'Condition'
  }
]*/

export const ConfigurationList: ConfigurationItem[] = FlowConfigurationComponentList

class FlowCore {
  public NodeList: ReactNodeConfig[] | any[] = components;
  public container!: HTMLDivElement;
  public lf!: LogicFlow;
  public graph!: Graph;
  public context!: Context;
  public isShowMenu = false;
  public menuPosition: Record<any, any>={
    x: 0,
    y: 0,
  }

  public currentModel: any;
  public initNode: any;
  public loading: any = true;
  public configuration!: Configuration

  constructor() {}
  public registerPatternItems() {
    this.lf.setPatternItems(
      [
        {
          type: 'start',
          text: '开始',
          label: '开始节点',
          icon: 'https://cdn.jsdelivr.net/gh/Logic-Flow/static@latest/core/start.png',
        },
        {
          type: 'rect',
          label: '系统任务',
          icon: 'https://cdn.jsdelivr.net/gh/Logic-Flow/static@latest/core/rect.png',
          className: 'import_icon',
        },
        {
          type: 'diamond',
          label: '条件判断',
          icon: 'https://cdn.jsdelivr.net/gh/Logic-Flow/static@latest/core/diamond.png',
        },
        {
          type: 'end',
          text: '结束',
          label: '结束节点',
          icon: 'https://cdn.jsdelivr.net/gh/Logic-Flow/static@latest/core/end.png',
        },
      ]
    )
  }

  /**
   * 初始化
   * @param container
   */
  public init(container: HTMLDivElement) {
    this.container = container;
    const context = new Context({ logicList: [] });
    this.context = context
    this.lf = new LogicFlow({
      container: this.container,
      autoExpand: false,
      hoverOutline: false,
      edgeSelectedOutline: false,
      style: {},
      // adjustEdge: false,
      // plugins: [MiniMap, SelectionSelect, Menu],
      plugins: [
        MiniMap,
        SelectionSelect,
        Popover,
        Snapshot,
        DndPanel
      ],
      keyboard: {
        enabled: true,
        shortcuts: [
          {
            keys: "backspace",
            callback: () => {
              const { edges } = this.lf.getSelectElements();
              // 默认只支持删除选中连线
              if (edges && edges.length === 1) {
                this.lf.deleteEdge(edges[0].id);
              }
            },
          },
        ],
      },
      grid: {
        size: 20,
        visible: true,
      },
    });
    this.registerNode(this.NodeList);
    this.lf.setDefaultEdgeType(LogicPolyline.type);

    this.lf.setTheme({
      arrow: {
        offset: 4,
        verticalLength: 3,
      },
      snapline: {
        stroke: "#2961EF", // 对齐线颜色
        strokeWidth: 1, // 对齐线宽度
      },
      bezier: {
        stroke: "#afafaf",
        strokeWidth: 2,
      },
    });

    this.graph = new Graph({
      lf: this.lf,
      context: context,
    });

    //this.graph.initView();

    // REMIND: 临时将 lf 挂到 window 方便调试
    window.lf = this.lf;

    this.initEvents();

    this.initPopover();

    this.configuration = new Configuration()
    ConfigurationList.forEach((item) => {
      this.configuration.setConfiguration(item.type, item.component)
    })
  }

  /**
   * 调用插入节点
   * @param key
   * @param data
   * @param _callback
   */
  public insertCommonNode(data: InsertCommonNodeData) {
    this.lf.graphModel.eventCenter.emit('node:add-node', data);
  }

  public initPopover() {
    const popover: Popover = this.lf.extension.popover as Popover;
    popover.registerPopover("tip", {
      // TODO: 后续支持传递属性
      render: (_rootEl: any, data: { props: { showConnectBlock: any; }; key: string; __id: string }) => {
        const model = this.lf.getNodeModelById(data.key)!;
        const props: InsertNodeMenuIProps = {
          lf: this.lf,
          context: this.context,
          graph: this.graph,
          model: this.currentModel || model,
          showConnectBlock: data.props.showConnectBlock,
          __id: data.__id,
          insertCommonNode: this.insertCommonNode.bind(this)
        }
        ReactDOM.createRoot(_rootEl!).render(
          <React.Fragment>
            <InsertNodeMenu {...props}></InsertNodeMenu>
          </React.Fragment>
        )
      },
    });
  }

  /**
   * 注册组件
   * @private
   */
  private registerNode(components: ReactNodeConfig[]) {
    this.lf.render({});
    for (let i = 0; i < components.length; i++) {
      register(
        components[i],
        this.lf,
      );
    }
  }

  private checkRelatedNode() {}

  private setGraphDataToContext() {
    const graphData = this.lf.getGraphData() as any;
    graphData.nodes.forEach((node: { properties: { logo: any; status: any; warnings: any; }; }) => {
      if (node.properties) {
        delete node.properties.logo;
        delete node.properties.status;
        delete node.properties.warnings;
      }
    });
    this.context.logicList = [graphData];
  }

  private initEvents() {
    // Context 事件监听
    // 点击组件时高亮对应节点
    this.context.eventCenter.on(
      EDITOR_EVENT.CANVAS_MODEL_CLICKED,
      (model: { id: any; }) => {
        this.graph.selectNodesByModel(model);
      }
    );
    this.context.eventCenter.on(
      EDITOR_EVENT.CANVAS_MODEL_DELETED,
      (model: any) => {
        console.log("EDITOR_EVENT.CANVAS_MODEL_DELETE", model);
        // this.checkRelatedComponent();
      }
    );

    // LF事件注册
    // 点击处理
    this.lf.on("node:select-click", (model) => {
      this.graph.selectNode(model);
      this.currentModel = model;
    });

    // 属性面板鼠标悬浮到某选项时高亮对应节点
    this.lf.on("node:hover-node", (model) => {
      this.graph.hoverNode(model);
    });

    // 属性面板鼠标悬浮到某选项时高亮对应节点
    this.lf.on("node:cancel-hover-node", (model) => {
      this.graph.cancelHoverNode(model);
    });

    // 鼠标移出节点后取消画布组件高亮
    this.lf.on("node:mouseleave", () => {
      this.context.eventCenter.emit(EDITOR_EVENT.LOGIC_NODE_HOVER, null);
    });

    // 监听node点击
    this.lf.on("node:click", (_data) => {
      console.log(_data);
      // const model = this.lf.getNodeModelById(data.data);
      // this.currentModel = model;
    });
    this.lf.on("history:change", () => {
      this.setGraphDataToContext();
    });
    this.lf.on("node:add-node", ({ model, type, properties, callback }) => {
      this.graph.insertNode(model, type, properties, callback);
    });
    this.lf.on("node:delete-node", (model) => {
      this.graph.deleteNode(model);
      const data = model.getData();
      if (
        data.type === "common-node" &&
        data.properties &&
        data.properties.ds
      ) {
        this.checkRelatedNode();
      }
    });
    this.lf.on("node:copy-node", (model) => {
      this.graph.copyNode(model);
    });

    // 如果画布上一个节点都没有了，添加一个引导节点
    this.lf.on("node:delete", ({ data }) => {
      const { nodes } = this.lf.getGraphData() as any;
      if (nodes.length === 0) {
        // 如果当前页面节点都被删除，就自动创建一个页面初始化节点
        this.initNode = this.graph.addInitNode();
      } else if (
        data.properties &&
        data.properties.componentName === "pageInit"
      ) {
        const hasInit = nodes.find(
          (item: { properties: { componentName: string; }; }) =>
            item.properties && item.properties.componentName === "pageInit"
        );
        if (!hasInit) {
          // 如果当前页面没有页面初始化节点了，就自动创建一个
          this.initNode = this.graph.addInitNode();
        }
      }
    });

    // 点击节点添加按钮后，显示添加菜单
    this.lf.on("node:add-click", ({ model, event }) => {
      this.currentModel = model;
      const x = event.clientX;
      const y = event.clientY;
      this.menuPosition = {
        x: x - 10,
        y: y - 10,
      };
      this.isShowMenu = true;
    });
    this.lf.on("edge:update-model", (model) => {
      this.currentModel = model;
    });
    this.lf.on("node:update-model", (model) => {
      this.currentModel = model;
      this.graph.selectNode(model);
    });
    this.lf.on("blank:click", () => {
      this.currentModel = null;
      this.graph.clearNodesStatus();
      this.context.eventCenter.emit(
        EDITOR_EVENT.CANVAS_MODEL_ACTIVATED,
        null
      );
    });
    this.lf.on("blank:contextmenu", ({ e, position: _position }) => {
      const x = e.clientX;
      const y = e.clientY;
      this.menuPosition = {
        x: x - 10,
        y: y - 10,
      };
      this.isShowMenu = true;
    });

    // this.lf.on("node:mouseenter", this.handlerNodeMouseenter.bind(this))
    // this.lf.on("node:mouseleave", this.handlerNodeMouseleave.bind(this))



  }

  private handlerNodeMouseenter(e: { data: any, e: MouseEvent }) {
    const model = this.lf.getNodeModelById(e.data.id)

    if (model) {
      console.log(model)
      model.setHovered(true)
      model?.updateAttributes({
        isHovered: true
      })
    }
  }

  private handlerNodeMouseleave(e: { data: any, e: MouseEvent }) {
    console.log(e);
    const model = this.lf.getModelById(e.data.id);
    if (model) {
      model.setHovered(false)
    }
  }


  public dispose() {
    this.lf.off("node:mouseenter", this.handlerNodeMouseenter)
    this.lf.off("node:mouseleave", this.handlerNodeMouseleave)
  }

}

export default FlowCore;

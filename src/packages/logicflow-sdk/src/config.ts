import {DefaultConfig, NormalNodeItemProperties, PageLifeCycleNodeItem} from "./core/types.ts";

export const config: {
  pageLifeCycleNodes: PageLifeCycleNodeItem[];
  pageUtilsNodes: NormalNodeItemProperties[];
  conditionUtilsNodes: NormalNodeItemProperties[];
  stateNodes: NormalNodeItemProperties[];
  defaultConfig: DefaultConfig;
} = {
  pageLifeCycleNodes: [
    {
      label: '页面加载',
      value: 'PageInit',
      logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png',
      __config__: {
        type: 'StartNode',
        aliasType: 'PageInitNode',
        isAllowAsTargetNode: false,
        correlationId: 'componentDidMount'
      }
    },
    {
      label: '页面卸载',
      value: 'PageUnmount',
      logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png',
      __config__: {
        type: 'StartNode',
        aliasType: 'PageUnmountNode',
        isAllowAsTargetNode: false,
        correlationId: 'componentWillUnmount'
      }
    }
  ],

  pageUtilsNodes: [
    {
      label: '请求数据',
      value: 'DataSource',
      logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_load.png',
      __config__: {
        type: "CommonNode",
        aliasType: "DataSource",
        correlationId: "",
        isAllowAsTargetNode: true
      }
    },
    {
      label: '页面跳转',
      value: 'PageJump',
      logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_jump.png',
      __config__: {
        type: "CommonNode",
        aliasType: "PageJump",
        correlationId: "",
        isAllowAsTargetNode: true
      }
    },
    {
      label: '数据转换',
      value: 'DataConvert',
      logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_trans.png',
      __config__: {
        type: "CommonNode",
        aliasType: "DataConvert",
        correlationId: "",
        isAllowAsTargetNode: true
      }
    }
  ],
  stateNodes: [
    {
      label: '更新数据',
      value: 'UpdateState',
      logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_load.png',
      __config__: {
        type: "CommonNode",
        aliasType: "UpdateState",
        correlationId: "",
        isAllowAsTargetNode: true
      }
    }
  ],
  conditionUtilsNodes: [
    {
      label: '条件判断',
      value: 'Condition',
      logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_load.png',
      __config__: {
        type: "CommonNode",
        aliasType: "Condition",
        correlationId: "",
        isAllowAsTargetNode: true
      }
    },
  ],
  defaultConfig: {
    start: {
      label: '组件',
      value: 'ComponentNode',
      logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png',
      __config__: {
        type: 'StartNode',
        aliasType: 'ComponentNode',
        isAllowAsTargetNode: true
      }
    }
  }
}
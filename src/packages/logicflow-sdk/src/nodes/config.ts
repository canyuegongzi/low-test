import {PageLifeCycleNodeItem} from "../core/types.ts";


export const commonNodeMap:  Record<string, PageLifeCycleNodeItem> = {
  DataSource: {
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
  PageJump: {
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
  DataConvert: {
    label: '数据转换',
    value: 'DataConvert',
    logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_trans.png',
    __config__: {
      type: "CommonNode",
      aliasType: "DataConvert",
      correlationId: "",
      isAllowAsTargetNode: true
    }
  },
}

export const eventNodeMap:  Record<string, PageLifeCycleNodeItem> = {
  ClickEvent: {
    label: '点击事件',
    value: 'ClickEvent',
    logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png',
    __config__: {
      type: "EventNode",
      aliasType: "ClickEvent",
      correlationId: "",
      isAllowAsTargetNode: true
    }
  }
}

export const PageLifeCycleNodeMap: Record<string, PageLifeCycleNodeItem> = {
  PageInit: {
    label: '页面初始化',
    value: 'PageInit',
    logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png',
    __config__: {
      type: 'StartNode',
      aliasType: 'PageInitNode',
      isAllowAsTargetNode: false,
      correlationId: 'componentDidMount'
    }
  },
  PageUnmount: {
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
}

export const defaultLogo = 'https://s3-gzpu.didistatic.com/tiyan-base-store/form-editor/pc/icon_anniu@2x.png'

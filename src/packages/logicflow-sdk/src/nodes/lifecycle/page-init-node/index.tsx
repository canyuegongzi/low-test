import { BaseNode } from "../../base";
class PageInitNodeModel extends BaseNode.model {
  /**
   * 获取节点的名称
   */
  public getNodeName () {
    return this.properties.name;
  }

  /**
   * 获取节点的抽象定义
   */
  public getNodeAbstract () {
    const title = '页面初始化'
    const content = []
    content.push ({
      desc: this.properties.name,
      type: 'PageInitNode'
    })
    return {
      title,
      content,
      showButton: false
    }
  }
  public getNodeLogo () {
    return this.properties && this.properties.logo
  }
  public getNodeClassName () {
    return 'pageLifecycle'
  }
}

export default {
  type: 'PageInitNode',
  component: BaseNode.component,
  model: PageInitNodeModel
}

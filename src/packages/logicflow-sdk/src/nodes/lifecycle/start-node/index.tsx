import { BaseNode } from "../../base";
class StartNodeModel extends BaseNode.model {
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
    const title = '开始'
    const content = []
    content.push ({
      desc: this.properties.name,
      type: 'StartNode'
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
  type: 'StartNode',
  component: BaseNode.component,
  model: StartNodeModel
}

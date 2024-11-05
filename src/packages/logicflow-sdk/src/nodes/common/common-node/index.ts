import { BaseNode } from "../../base";

/**
 * 通用的节点信息
 */
class CommonNodeModel extends BaseNode.model {
  public getNodeName () {
    return this.properties.name
  }
  public getNodeAbstract () {
    const title = '数据请求'
    const content = []
    if (this.properties && this.properties.ds) {
      content.push ({
        desc: this.properties.ds.name,
        type: 'common'
      })
    }
    return {
      title,
      content,
      showButton: true
    }
  }
  public getNodeLogo () {
    return this.properties && this.properties.logo
  }
  public getNodeClassName () {
    return 'common'
  }
}

export default {
  type: 'CommonNode',
  component: BaseNode.component,
  model: CommonNodeModel
}

import {BaseNode} from "../../base";
class ReactionNodeModel extends BaseNode.model {
  public getNodeName () {
    return this.properties.name
  }
  public getNodeAbstract () {
    const title = '节点行为'
    const content: any[] = []
    if (this.properties && this.properties.reactions && this.properties.reactions.length) {
      this.properties.reactions.forEach((item: any) => {
        content.push({
          desc: item.keyDefine,
          type: 'reaction'
        })
      });
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
}

export default {
  type: 'ReactionNode',
  component: BaseNode.component,
  model: ReactionNodeModel
}

import { BaseNode } from "../../base";
class EventNodeModel extends BaseNode.model {
  public getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = 'none';
    (style.hover as any).stroke = 'none';
    return style;
  }
  public getDefaultAnchor() {
    const {
      id,
      x,
      y,
      width,
    } = this;
    const anchors = [];
    anchors.push({
      x: x + width / 2,
      y,
      id: `${id}_outgoing`,
      type: "outgoing"
    });
    return anchors;
  }
  public getNodeName () {
    if (this.properties && this.properties.event && this.properties.event.keyDefine) {
      return this.properties.name + this.properties.event.keyDefine
    }
    return this.properties.name
  }
  public getNodeAbstract () {
    const title = '节点事件'
    const content = []
    let showButton = true
    if (this.properties && this.properties.componentName === 'pageInit') {
      content.push({
        desc: '页面初始化',
        type: 'event'
      })
      showButton = false
    } else if (this.properties.event && this.properties.event.keyDefine) {
      content.push({
        desc: this.properties.event.keyDefine,
        type: 'event'
      })
    }
    return {
      title,
      content,
      showButton,
    }
  }
  public getNodeLogo () {
    return this.properties && this.properties.logo
  }
  public getNodeClassName () {
    return 'event'
  }
}

export default {
  type: 'EventNode',
  component: BaseNode.component,
  model: EventNodeModel
}

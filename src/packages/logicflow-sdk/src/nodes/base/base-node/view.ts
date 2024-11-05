import {ReactNodeView} from "@logicflow/react-node-registry";
import {h} from "@logicflow/core";
import {Model} from "@logicflow/core/lib/model";

export class View extends ReactNodeView {
  getAnchorShape(anchorData:  Model.AnchorConfig) {
    const { x, y, type } = anchorData
    return h('rect', {
      x: x - 3,
      y: y - 3,
      width: 6,
      height: 6,
      className: `custom-anchor ${type === 'incomming' ? 'incomming-anchor' : 'outgoing-anchor'}`
    })
  }
}

import LogicFlow, { HtmlNodeModel } from '@logicflow/core'
import { cloneDeep } from 'lodash-es'
import {Model} from "@logicflow/core/lib/model";
import {NormalNodeItemProperties} from "../../../core/types.ts";

export type CustomProperties = {
  // 形状属性
  width?: number
  height?: number
  radius?: number

  // 文字位置属性
  refX?: number
  refY?: number

  // 样式属性
  style?: LogicFlow.CommonTheme
  textStyle?: LogicFlow.TextNodeTheme
}

export const NODE_WIDTH = 100 // 节点宽度
export const NODE_HEIGHT = 28 // 节点高度

const NEXT_X_DISTANCE = 200
const NEXT_Y_DISTANCE = 100


interface BaseModelIProps {
  [key: string]: any;
}

export class BaseNodeModel extends HtmlNodeModel<BaseModelIProps> {
  getTextStyle(): LogicFlow.TextNodeTheme {
    // const { x, y, width, height } = this
    const {
      refX = 0,
      refY = 0,
      textStyle,
    } = this.properties as CustomProperties
    const style = super.getTextStyle()

    // 通过 transform 重新设置 text 的位置
    return {
      ...style,
      ...(cloneDeep(textStyle) || {}),
      transform: `matrix(1 0 0 1 ${refX} ${refY})`,
    }
  }

  getNodeStyle(): LogicFlow.CommonTheme {
    const style = super.getNodeStyle()
    const {
      style: customNodeStyle,
      // radius = 0, // 第二种方式，设置圆角
    } = this.properties as CustomProperties

    return {
      ...style,
      ...(cloneDeep(customNodeStyle) || {}),
      // rx: radius,
      // ry: radius,
    }
  }

  setAttributes() {
    this.width = NODE_WIDTH
    this.height = NODE_HEIGHT + 13 * 2
    this.text.editable = false
    this.sourceRules.push({
      message: '只允许从右边的锚点连出',
      validate: (_sourceNode, _targetNode, _sourceAnchor, targetAnchor) => {
        return targetAnchor?.type === 'incomming'
      }
    })
  }
  setHeight(val: number) {
    this.height = val
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle()
    style.stroke = 'none';
    (style.hover as any).stroke = 'none'
    return style
  }
  getDefaultAnchor() {
    const { id, x, y, width } = this
    const anchors = []
    anchors.push({
      x: x - width / 2,
      y,
      id: `${id}_incomming`,
      edgeAddable: false,
      type: 'incomming'
    })
    anchors.push({
      x: x + width / 2,
      y,
      id: `${id}_outgoing`,
      type: 'outgoing'
    })
    return anchors
  }
  addNode(node: any, nextY = 0) {
    const isDeep = nextY !== 0
    const nodeModel = this.graphModel.getNodeModelById(node.sourceId);
    const leftTopX = node.x + NEXT_X_DISTANCE - 50 - 10
    const leftTopY = node.y + nextY - 40 - 8
    const rightBottomX = node.x + NEXT_X_DISTANCE + 50 + 10
    const rightBottomY = node.y + nextY + 40 + 8
    const existElements = this.graphModel.getAreaElement(
      this.getHtmlPoint([leftTopX, leftTopY]),
      this.getHtmlPoint([rightBottomX, rightBottomY])
    )
    if (existElements.length) {
      this.addNode(node, nextY + NEXT_Y_DISTANCE)
      return
    }
    const newNode = this.graphModel.addNode({
      type: node.type,
      x: node.x + NEXT_X_DISTANCE,
      y: node.y + nextY,
      properties: node.properties
    })
    let startPoint
    let endPoint
    if (isDeep) {
      startPoint = {
        x: node.x,
        y: node.y + (nodeModel as any).height / 2
      }
      endPoint = {
        x: newNode.x - newNode.width / 2,
        y: newNode.y
      }
    }
    this.graphModel.addEdge({
      sourceNodeId: node.sourceId,
      targetNodeId: newNode.id,
      startPoint,
      endPoint
    })
    this.graphModel.selectElementById(newNode.id)
    this.graphModel.showContextMenu(newNode)
  }

  isAllowConnectedAsTarget(_source: BaseNodeModel, _sourceAnchor?: Model.AnchorConfig, _targetAnchor?: Model.AnchorConfig, _edgeId?: string): Model.ConnectRuleResult {
    return  {
      isAllPass: true,
      msg: ''
    }
  }


  /**
   * 处理连线时是否允许连线到目标节点
   * @param target
   * @param _sourceAnchor
   * @param _targetAnchor
   * @param _edgeId
   */
  isAllowConnectedAsSource(target: BaseNodeModel, _sourceAnchor?: Model.AnchorConfig, _targetAnchor?: Model.AnchorConfig, _edgeId?: string): Model.ConnectRuleResult {

    const properties: NormalNodeItemProperties = target.properties as NormalNodeItemProperties;

    // 配置了节点不允许作为目标节点连线的情况下， 不允许连线
    if (properties?.__config__?.isAllowAsTargetNode === false) {
      return  {
        isAllPass: false,
        msg: `${properties.label}不允许作为目标节点`
      }
    }
    return  {
      isAllPass: true,
      msg: ''
    }
  }
}

export default BaseNodeModel

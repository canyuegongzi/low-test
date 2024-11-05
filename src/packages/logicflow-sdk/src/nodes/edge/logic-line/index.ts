import {h, LogicFlow, pointFilter, PolylineEdge, PolylineEdgeModel} from "@logicflow/core";
import { LINE_OFFSET, NODE_HEIGHT } from "../../constant.ts";
import EdgeConfig = LogicFlow.EdgeConfig;
import LineContent from "./component.tsx";
import {createElement} from "react";
import ReactDOM from "react-dom/client";

export const DISTANCE = 12
export const ICON_HEIGHT = 16
export const ICON_WIDTH = 16
export const WORD_HEIGHT = 16
class LogicPolyline extends PolylineEdge {
  public ins: any;
  constructor(_props: any) {
    // @ts-ignore
    super(_props)
    this.ins = createElement(LineContent, {
      model: _props.model,
      graphModel:_props.graphModel,
      properties: _props.model.getProperties(),
      isSelected: _props.model.isSelected,
      isHovered: _props.model.isHovered
    } as any, null)
  }
  shouldUpdate() {
    const data = {
      ...this.props.model.properties,
      isSelected: this.props.model.isSelected,
      isHovered: this.props.model.isHovered
    }
    if ((this as any).preProperties && (this as any).preProperties === JSON.stringify(data)) return
    (this as any).preProperties = JSON.stringify(data)
    return true
  }
  getText() {
    // 几种情况的处理：1.一个节点连出多条边 2.一个节点的入口连入多条边 3.线的回连
    const { graphModel } = this.props
    const { pointsList, targetNodeId } = this.props.model
    if (!pointsList || pointsList.length === 0) return null
    let width = 0
    let height = 0
    let direction = ''
    const positionData: any = {}
    const targetInlines = graphModel.getNodeIncomingEdge(targetNodeId)
    // 如果后一个节点入口有多条线
    if (targetInlines.length && targetInlines.length > 1) {
      let lastPoint: any = {}, lastPrePoint: any = {}
      if (pointsList.length >= 4) {
        lastPoint = pointsList[pointsList.length - 2]
        lastPrePoint = pointsList[pointsList.length - 3]
      } else {
        lastPoint = {
          x: pointsList[0].x + LINE_OFFSET,
          y: pointsList[0].y
        }
        lastPrePoint = pointsList[0]
      }
      width = Math.abs(lastPoint.x - lastPrePoint.x)
      height = Math.abs(lastPoint.y - lastPrePoint.y)
      direction = ''
      positionData.x = (lastPoint.x + lastPrePoint.x)/2 - ICON_HEIGHT / 2
      positionData.y = (lastPoint.y + lastPrePoint.y)/2 - ICON_HEIGHT / 2
    } else {
      const lastPoint = pointsList[pointsList.length - 1]
      const lastPrePoint = pointsList[pointsList.length - 2]
      // let maxWidth = Math.max(Math.abs(lastPoint.x - lastPrePoint.x), Math.abs(lastPoint.y - lastPrePoint.y));
      width = Math.abs(lastPoint.x - lastPrePoint.x)
      height = Math.abs(lastPoint.y - lastPrePoint.y)
      direction = ''
      if (lastPoint.x < lastPrePoint.x) {
        // 箭头向左
        direction = 'row'
        positionData.x = lastPoint.x + DISTANCE
        positionData.y = lastPoint.y - ICON_HEIGHT / 2
      } else if (lastPoint.y < lastPrePoint.y) {
        // 箭头向上
        direction = 'column'
        positionData.x = lastPoint.x - ICON_WIDTH / 2
        positionData.y = lastPoint.y + DISTANCE + ICON_HEIGHT / 2
      } else if (lastPoint.y > lastPrePoint.y) {
        // 箭头向下
        direction = 'column-reverse'
        positionData.x = lastPoint.x - ICON_WIDTH / 2
        positionData.y = lastPoint.y - DISTANCE - ICON_HEIGHT / 2 - WORD_HEIGHT
      } else {
        // 箭头向右
        direction = 'row-reverse'
        positionData.x = lastPoint.x - DISTANCE - width
        positionData.y = lastPoint.y - ICON_HEIGHT / 2
      }
    }

    const { model } = this.props
    const id = model.id
    setTimeout(() => {
      const addContainer = document.querySelector('#' + 'line_' + id)?.querySelector('.add-wrapper')
      ReactDOM.createRoot(addContainer!).render(this.ins)
    }, 0)
    return h(
      'foreignObject',
      { ...positionData, id: 'line_' + id, style: `z-index: 20; width: ${width ? width : height}px` },
      [
        h(
          'div',
          {
            style: `display:flex;width: 100%;flex-direction: ${direction};`
          },
          [
            h('div', {
              className: 'add-wrapper'
            })
          ]
        )
      ]
    )
  }
}
class LogicPolylineModel extends PolylineEdgeModel {
  initEdgeData(data: EdgeConfig) {
    super.initEdgeData(data)
    this.offset = LINE_OFFSET
  }
  setAttributes() {
    this.offset = LINE_OFFSET
    if (this.properties.executeStatus === 'executed') {
      this.setZIndex()
    } else {
      this.setZIndex(0)
    }
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle()
    style.stroke = '#8790A0'
    style.strokeDasharray = '3 2'
    style.strokeWidth = 1
    if (this.isHovered || this.isSelected) {
      style.stroke = '#33DD89'
    }
    return style
  }
  getNodeStyle() {
    return {

    }

  }
  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle()
    style.animationDuration = '20s'
    const { executeStatus } = this.properties
    if (executeStatus) {
      style.strokeDasharray = '8 3'
      style.stroke = executeStatus === 'executed' ? 'rgb(79 235 151 / 80%)' : 'red'
      if (executeStatus === 'execute-failed') {
        (style as any).strokeDasharray = null
      }
    } else {
      style.strokeDasharray = '8 3'
      style.stroke = '#33DD89'
    }
    return style
  }
  setHovered(flag?: boolean) {
    super.setHovered(flag)
    this.setZIndex(flag ? 999 : 0)
  }
  setSelected(flag?: boolean) {
    super.setSelected(flag)
    this.setZIndex(flag ? 999 : 0)
  }
  setZIndex(index?: number) {
    if (this.isHovered || this.isSelected || this.properties.executeStatus) {
      super.setZIndex(999)
      this.openEdgeAnimation()
    } else {
      this.closeEdgeAnimation()
      super.setZIndex(index)
    }
  }
  initPoints() {
    if (this.pointsList && this.pointsList.length > 0) {
      this.points = this.pointsList.map((point) => `${point.x},${point.y}`).join(' ')
      return
    }
    const { startPoint, endPoint } = this
    const { x: x1, y: y1 } = startPoint
    const { x: x2, y: y2 } = endPoint
    const betterDistance = (this.offset || 0) * 2
    // 1. 起点在终点左边
    if (x1 - x2 < -betterDistance) {
      this.pointsList = pointFilter([
        {
          x: x1,
          y: y1
        },
        {
          x: x1 + (this.offset || 0),
          y: y1
        },
        {
          x: x1 + (this.offset || 0),
          y: y2
        },
        {
          x: x2,
          y: y2
        }
      ])
      this.points = this.pointsList.map((point) => `${point.x},${point.y}`).join(' ')
    } else if (x1 - x2 > betterDistance) {
      // 起点在右边，终点在左边
      this.pointsList = pointFilter([
        {
          x: x1,
          y: y1
        },
        {
          x: x1 + (this.offset || 0),
          y: y1
        },
        {
          x: x1 + (this.offset || 0),
          y: y2 + NODE_HEIGHT
        },
        {
          x: x2 - NODE_HEIGHT / 2,
          y: y2 + NODE_HEIGHT
        },
        {
          x: x2 - NODE_HEIGHT / 2,
          y: y2
        },
        {
          x: x2,
          y: y2
        }
      ])
      this.points = this.pointsList.map((point) => `${point.x},${point.y}`).join(' ')
    } else {
      super.initPoints()
    }
  }

  getOuterGAttributes() {
    return {
      className: '',
    }
  }
}

export default {
  type: 'LogicLine',
  model: LogicPolylineModel,
  // component: LineContent
  view: LogicPolyline
}

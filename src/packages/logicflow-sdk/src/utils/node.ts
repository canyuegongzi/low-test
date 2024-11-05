/**
 * 根据组件model生成节点名
 */
export const getNodeName = ( model: { getModelName: () => any; name: any; componentName: any } ) => {
  return model.getModelName() || model.name || model.componentName
}

/**
 * 聚焦至该节点
 */
export const focusNode = function (graphModel: { selectElementById: (arg0: any) => void; getElement: (arg0: any) => any; rootEl: { getBoundingClientRect: () => any; }; transformModel: { focusOn: (arg0: any, arg1: any, arg2: number, arg3: number) => void; }; }, id: any, deltaX: number) {
  graphModel.selectElementById(id)
  const model = graphModel.getElement(id)
  const rect = graphModel.rootEl.getBoundingClientRect()
  const dx = deltaX || 0
  graphModel.transformModel.focusOn(model.x + dx, model.y, Number(rect.width), Number(rect.height))
}
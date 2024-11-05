import {ActionStatus, BaseNode, TaskNode} from "@logicflow/engine";

export class StartNode extends TaskNode {
  async action(): Promise<BaseNode.ActionResult | undefined> {

    console.log("runner:StartNode", this)
    /*this.globalData['dataSource'] = {
      time: (this.context?.getTime as any)(),
    }*/
    return {
      status: ActionStatus.SUCCESS,
      detail: {
        customData: '2',
      },
    }
  }
}
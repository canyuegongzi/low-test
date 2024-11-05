import {ActionStatus, BaseNode, TaskNode} from "@logicflow/engine";

export class PageInitNode extends TaskNode {
  async action(): Promise<BaseNode.ActionResult | undefined> {

    console.log("this.action", this)
    this.globalData['dataSource'] = {
      time: (this.context?.getTime as any)(),
    }
    return {
      status: ActionStatus.SUCCESS,
      detail: {
        customData: '2',
      },
    }
  }
}
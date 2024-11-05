import Engine from "@logicflow/engine";
import {CommonNode, StartNode} from "./nodes";
import GraphData = LogicFlow.GraphData;
import NodeConfig = LogicFlow.NodeConfig;
import {LogicFlow} from "@logicflow/core";

interface ComponentDSL {
  [key: string]: any
}

interface BaseSchemaDSL {
  [key: string]: any
}

interface ExecuteContext extends Record<any, any> {
  pageInstance: any;
  schema?: ComponentDSL;
  args?: any;
}
export class Runner{
  public nodes: NodeConfig[] = [
    {
      type: 'CommonNode',
      model: CommonNode,
      x: 0,
      y: 0
    },
    {
      type: 'StartNode',
      model: StartNode,
      x: 0,
      y: 0
    }
  ]

  constructor() {}

  public registerNode(nodes: NodeConfig[]) {
    const list: NodeConfig[] = this.nodes.concat(nodes);

    this.nodes = list.reduce((previousValue: NodeConfig[], currentValue: NodeConfig) => {
      const x = previousValue.find(item => item.type === currentValue.type);
      if (!x) {
        return previousValue.concat([currentValue]);
      } else {
        return previousValue;
      }
    }, []);
  }

  /**
   * 执行
   */
  public async execute(graphData: GraphData, context?: ExecuteContext) {
    console.log("runner:开始执行", graphData)
    const engine = new Engine({
      context: context,
      debug: true,
    })
    this.nodes.forEach(item => {
      engine.register({
        type: item.type,
        model: item.model,
      })
    })

    engine.load({
      graphData,
      globalData: {},
      startNodeType: 'StartNode'
    })
    const result = await engine.execute()
    console.log("runner:", result)

    const res = await engine.getExecutionRecord(result.executionId);
    console.log(res);
  }

  public getRenderSchema(): BaseSchemaDSL {
    return (window as any).__RENDER_PAGE_STATE__
  }




  /**
   * 执行声明周期流程编排逻辑
   * @param lifeCycle
   * @param schema
   * @param context
   * @param args
   */
  public async executeLifeCycle(lifeCycle: string, schema: ComponentDSL, context: any, args: any) {
    const pageSchema = this.getRenderSchema();
    const flowSchema: any[] = pageSchema.flows || []
    const flowIdList: string[] = schema?.lifeCycles?.[lifeCycle]?.flowIdList || [];
    if (flowIdList && flowIdList?.length) {
      console.log("runner,flowIdList:", flowIdList)
      for (let i= 0; i < flowIdList.length; i ++) {
        const id = flowIdList[i];
        const flow = flowSchema.find(item => item.code === id);
        if (flow) {
          await this.execute(flow.data, {
            pageInstance: context,
            schema,
            args
          })
        }
      }
    }
  }

}

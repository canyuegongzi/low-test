import {BaseNode, TaskNode} from "@logicflow/engine";
import {ActionStatus} from "@logicflow/engine/es/constant";
import {ConditionsEmitValueConfig, EmitParamCollectorValue, EmitParamValueTable} from "../type.ts";
import {evaluate} from "./condition.ts";
import { updateState } from "./updateState.ts";


type CommonNodeType = 'DataSource' | 'PageJump' | 'Condition' | 'UpdateState'

// @ts-ignore
export class CommonNode extends TaskNode {

  private parseData(list: EmitParamCollectorValue[]): Record<any, any> {
    const result: Record<string, any> = {};
    list.forEach((item) => {
      const valueType = item.value.valueType
      const type = item.value.type
      if (valueType === 'input') {
        let value: any = item.value.value;
        if (type === 'number') {
          value = Number(value)
        }
        if (type === 'boolean') {
          value = [true, 'true'].includes(value)
        }
        result[item.key] = value;
      }
      else {
        result[item.key] = item.value.value;
      }

    })

    return result

  }


  /**
   * 加载数据请求
   * @private
   */
  private async fetchDataSource(): Promise<Record<string, unknown>> {
    console.log(this.context)
    console.log(this)
    const properties = this.properties || {};
    const biz: Record<any, any> = properties.biz || {};
    const {value = {}, onFailureConfig = {}} = biz;
    const {continueOnFailure} = onFailureConfig;
    const {
      bodyList = [],
      paramsList = [],
      requestMethod = 'GET',
      requestUrl = ''

    } = value
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.context.pageInstance.utils.request({
          method: requestMethod.toLowerCase(),
          url: requestUrl,
          data: this.parseData(bodyList),
          params: this.parseData(paramsList)
        })
        resolve({
          continueOnFailure,
          bodyList,
          res,
          paramsList,
          requestMethod
        })
      }catch (e) {
        reject(e)
      }

    })
  }

  /**
   * 行为
   */
  async action(): Promise<BaseNode.ActionResult | undefined> {
    try {
      console.log("runner:CommonNode", this)
      const value: CommonNodeType = this.properties?.value as CommonNodeType;
      let response: any = undefined;

      if (value === 'DataSource') {
        response = await this.fetchDataSource();
      }

      if (value === 'PageJump') {
        response = true;
      }

      if (value === 'Condition') {
        const isPass = await this.getConditionIsPass();
        console.log("执行action", isPass);
        response = isPass
      }
      if (value === 'UpdateState') {
        response = await this.updateState()
      }
      this.globalData.actionResponse = response
      return {
        detail: response,
        status: ActionStatus.SUCCESS
      }
    }catch (e) {
      const continueOnFailure: boolean = (this.properties?.biz as any)?.onFailureConfig?.continueOnFailure;
      console.log(e)
      if(continueOnFailure) {
        return {
          detail: e as any,
          status: ActionStatus.SUCCESS
        }
      }
      return {
        detail: e as any,
        status: ActionStatus.ERROR
      }
    }

  }

  /**
   * 执行条件节点
   * @param value
   * @private
   */
  private runConditions(value: ConditionsEmitValueConfig): boolean {
    try {
      const scope = this.context.pageInstance;
      console.log("scope", scope);
      return evaluate(value, scope, this);
    }catch (e) {
      console.log(e);
      return false
    }

  }

  private async getConditionIsPass(): Promise<boolean> {
    if (!this.properties) return true
    const { biz } = (this.properties || {}) as any;

    try {
      const bizValue = biz.value as ConditionsEmitValueConfig;
      return this.runConditions(bizValue)
    } catch (error) {
      return false
    }
  }

  private async updateState(): Promise<boolean> {
    if (!this.properties) return true
    const { biz } = (this.properties || {}) as any;

    try {
      const bizValue = biz.value as EmitParamValueTable[];
      const scope = this.context.pageInstance;
      console.log("updateState", bizValue)
      updateState(bizValue, scope, this)
      return true;
    } catch (error) {
      return false
    }
  }


  /**
   * 是否执行
   * @param _properties
   */
  protected override async isPass(_properties?: Record<string, unknown>): Promise<boolean> {
    if (!this.properties) return true
    const { value } = (this.properties || {}) as any;

    if (value === 'Condition') {
      if (this.globalData.actionResponse !== undefined && typeof this.globalData.actionResponse === 'boolean') {
        return this.globalData.actionResponse;
      }
      this.globalData.actionResponse = await this.getConditionIsPass();
      return this.globalData.actionResponse as boolean;

    }
    return true
  }
}

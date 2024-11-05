import { ComponentDSL } from "@lowcode-set-up-platform/dsl";
import {VariableItem} from "@lowcode-set-up-platform/editor";

export interface NodeConfig {
  type: string;
  aliasType: string;
  correlationId?: string;
  isAllowAsTargetNode?: boolean;
}
export interface PageLifeCycleNodeItem {
  label: string;
  value:  string;
  logo: string;
  __config__: NodeConfig
}

export type NormalNodeItemProperties  = PageLifeCycleNodeItem;
export interface DefaultConfig {
  start: PageLifeCycleNodeItem
}

type getVariables = () => VariableItem[]
interface VariableProvideConfig {
  pageStates: VariableItem[] | getVariables
  pageMethods: VariableItem[] | getVariables
  systemRouterParams: VariableItem[] | getVariables
  systemDevice: VariableItem[] | getVariables
}
export interface LogicPanelConfig {
  pageLifeCycleNodes: PageLifeCycleNodeItem[];
  pageUtilsNodes?: NormalNodeItemProperties[];
  conditionUtilsNodes?: NormalNodeItemProperties[];
  stateNodes?: NormalNodeItemProperties[];
  componentsTree: ComponentDSL[];
  defaultConfig: DefaultConfig;
  variableProvideConfig?: VariableProvideConfig;
}

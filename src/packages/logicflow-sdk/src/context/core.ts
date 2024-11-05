import {createContext, ReactNode} from "react";
import { LogicFlow } from "@logicflow/core";
import FlowCore from "../core/FlowCore";
import {LogicPanelConfig} from "../core/types.ts";

interface ConditionOption {
  value: string;
  label: string;
}
export interface ConditionConfigItem {
  icon: string | ReactNode;
  name: string;
  key: string;
  getOptions: (key: string) => ConditionOption[]
}
export interface ConditionConfig {
  items: ConditionConfigItem[]
}
interface CoreContentIProps extends LogicPanelConfig{
  lf?: LogicFlow;
  flowCore?: FlowCore;
  renderRefInstance?: any;
}

const CoreContext = createContext<CoreContentIProps>({

} as CoreContentIProps);

export default CoreContext

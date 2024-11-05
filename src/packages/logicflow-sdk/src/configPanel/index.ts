import DataSource, { DataSourcePanel } from "./dataSource";
import PageJump, {PageJumpPanel} from "./pageJump";
import PageInitNode, {PageInitNodePanel} from "./pageInitNode";
import PageUnmountNode, {PageUnmountNodePanel} from "./pageUnmountNode";
import Condition, {ConditionPanel} from "./condition";
import UpdateState, {UpdateStatePanel} from "./updateState";

export const FlowConfigurationComponents = {
  DataSourcePanel,
  PageJumpPanel,
  PageInitNodePanel,
  PageUnmountNodePanel,
  ConditionPanel,
  UpdateStatePanel
}

export const FlowConfigurationComponentList = [
  DataSource,
  PageJump,
  PageInitNode,
  PageUnmountNode,
  Condition,
  UpdateState
]

export default FlowConfigurationComponents

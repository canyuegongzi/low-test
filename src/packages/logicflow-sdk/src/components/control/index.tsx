import FlowCore from "../../core/FlowCore.tsx";
import styles from './index.module.scss'
import {Tooltip} from "antd";
import {
  AimOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined, ExpandOutlined,
  ReloadOutlined, VerticalAlignBottomOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from "@ant-design/icons";
import {MiniMap} from "@logicflow/extension";

interface IProps {
  flowCore: FlowCore;
}
export const Control = (props: IProps) => {
  const zoomIn = () => {
    props.flowCore.lf.zoom(true);
  };

  const zoomOut = () => {
    props.flowCore.lf.zoom(false);
  };

  const zoomReset = () => {
    props.flowCore.lf.resetZoom();
  };

  const reset = () => {
    props.flowCore.lf.resetZoom();
    props.flowCore.lf.resetTranslate();
  };

  const undo = () => {
    props.flowCore.lf.undo();
  };

  const redo = () => {
    props.flowCore.lf.redo();
  };
  const showMiniMap = () => {
    const miniMap = props.flowCore.lf.extension.miniMap as MiniMap
    if ((miniMap as any).isShow) {
      miniMap.hide();
      return;
    }
    miniMap?.show?.(props.flowCore.lf.graphModel.width - 168, 220);
  };

  const download = () => {
    // @ts-ignore
    props.flowCore.lf.extension.snapshot.customCssRules = `
    .lf-canvas-overlay {
      background: #f0f4fb;
    }
  `;
    props.flowCore.lf.getSnapshot();
  };
  return (
    <div className={styles.control}>
      <div className={styles.panelLayout}>
        <Tooltip placement="left" title={"放大"}>
          <ZoomInOutlined onClick={zoomIn} />
        </Tooltip>

        <Tooltip placement="left" title={"缩小"}>
          <ZoomOutOutlined onClick={zoomOut} />
        </Tooltip>

        <Tooltip placement="left" title={"大小适应"}>
          <AimOutlined onClick={zoomReset} />
        </Tooltip>

        <Tooltip placement="left" title={"定位还原(大小&定位)"}>
          <ReloadOutlined onClick={reset} />
        </Tooltip>

        <Tooltip placement="left" title={"上一步"}>
          <DoubleLeftOutlined onClick={undo} />
        </Tooltip>

        <Tooltip placement="left" title={"下一步"}>
          <DoubleRightOutlined onClick={redo} />
        </Tooltip>

        <Tooltip placement="left" title={"小地图"}>
          <ExpandOutlined onClick={showMiniMap} />
        </Tooltip>

        <Tooltip placement="left" title={"下载图片"}>
          <VerticalAlignBottomOutlined onClick={download} />
        </Tooltip>

      </div>
    </div>
  )

}
import { FC, Key, useEffect, useMemo, useRef, useState } from 'react';
import { Popover } from 'antd';
import styles from './index.module.scss'
import classNames from "classnames";

const LineContent:  FC<any> = (props) => {
  const { model: model, graphModel: graphModel,  }= props;
  const [popVisible, setPopVisible] = useState(false);
  const iconEvent = useRef<any>();

  const properties = useMemo(() => {
    // const data = model.getProperties();
    if (!model.properties) model.properties = {};
    return model.properties
  }, [model])

  const isSelected = useMemo(() => {
    return model.isSelected
  }, [model])

  const isHovered = useMemo(() => {
    return model.isHovered
  }, [model])



  useEffect(() => {
    const unsubscribe = [
      graphModel?.eventCenter.on('blank:click', hidePop),
      graphModel?.eventCenter.on('node:click', hidePop),
      graphModel?.eventCenter.on('edge:click', hidePop)
    ];

    return () => unsubscribe.forEach((cb: any) => cb?.());

  }, [graphModel.eventCenter]);

  const hidePop = () => {
    setPopVisible(false);
    if (graphModel.popover) {
      graphModel.popover.hide(popoverItemKey);
    }
  };

  const handleIconClick = (e: any) => {
    iconEvent.current = e;
    setPopVisible(true);
    graphModel.eventCenter.emit('edge:update-model', model);
  };

  const goCondition = () => {
    graphModel.eventCenter.emit('edge:option-click', model);
    setPopVisible(false);
  };

  const insertNode = () => {
    const {clientX, clientY} = iconEvent.current.nativeEvent;
    const point = graphModel.getPointByClient({x: clientX + 16, y: clientY + 6});
    const canvasPoint = point.canvasOverlayPosition;
    popoverItemKey = graphModel.popover.show({
      type: 'tip',
      delay: 100,
      key: model.id,
      placement: 'right',
      trigger: 'click',
      width: 16,
      height: 16,
      x: canvasPoint.x - 6,
      y: canvasPoint.y,
      props: {
        showConnectBlock: false
      }
    });
    setPopVisible(false);
  };

  const getConditionItem = (item: { type: any; componentName: any; propName: any; nodeId: any; value: any; }) => {
    return formatValue(item);
  };

  const formatValue = (val: { type: any; componentName: any; propName: any; nodeId: any; value: any; }) => {
    switch (val.type) {
      case 'component':
      case 'componentProp':
        return `${val.componentName}的${val.propName}`;
      case 'dataSource':
        return `数据节点${val.nodeId}返回值`;
      case 'initParam':
        return `初始化参数值为: ${val.value}`;
      default:
        return '';
    }
  };

  let popoverItemKey: any;

  const renderPopoverContent = () => {
    if (properties.condition && properties.condition.conditions && properties.condition.conditions.length) {
      return (
        <div className={styles['popover-content']}>
          <div className={styles['condition-wrap']}>
            <div className={styles['condition-title']}>我配置的条件</div>
            <div className={styles['condition-content']}>
              {properties.condition.conditions.map((item: any, index: Key | null | undefined) => (
                <div key={index} className={styles['condition-item']}>
                  <img
                    className={styles['icon']}
                    src="https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/edge_condition.png"
                    alt=""
                  />
                  <span>{getConditionItem(item)}</span>
                </div>
              ))}
              <div className={styles['condition-button']}  onClick={goCondition}>去配置</div>
            </div>
          </div>
          <div className={styles['popover-item']} onClick={insertNode}>
            <img
              className={styles['icon']}
              src="https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/pop_insert_node.png"
              alt=""
            />
            插入节点
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles['popover-content']}>
          <div className={styles['popover-item']} onClick={goCondition}>
            <img
              className={styles['icon']}
              src="https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/pop_add_option.png"
              alt=""
            />
            添加条件
          </div>
          <div className={styles['popover-item']} onClick={insertNode}>
            <img
              className={styles['icon']}
              src="https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/pop_insert_node.png"
              alt=""
            />
            插入节点
          </div>
        </div>
      );
    }
  };

  const iconSrc = properties.condition && properties.condition.conditions && properties.condition.conditions.length
    ? "https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/edge_condition.png"
    : "https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/edge_add.png";

  return (
    <div className={classNames(
      styles['line-content'],
      {
        [styles['selected']]: isSelected
      }
    )}>
      <Popover
        content={renderPopoverContent()}
        placement="right"
        overlayInnerStyle={{
          //width: properties.condition && properties.condition.conditions && properties.condition.conditions.length? 200: 100
          width: 150
        }}
        open={popVisible}
        onOpenChange={setPopVisible}
        trigger="click"
      >
        {
          (isHovered || isSelected) && (
            <div className={classNames(
              styles['line-icon'], {[styles['selected']]: isSelected}
            )} onClick={handleIconClick}>
              <img
                className={classNames(styles.icon)}
                src={iconSrc}
                alt=""
              />
            </div>
          )
        }
      </Popover>
    </div>
  );
};

export default LineContent;

export interface ConfigurationItem {
  type: 'DataSource' | 'PageJump' | 'PageInitNode' | 'PageUnmountNode' | 'ClickEvent' | 'DataConvert' | 'Condition' | string;
  component: React.ComponentType | React.FunctionComponent | React.FC<any>
}
export class Configuration {
  private configurations: Map<string, ConfigurationItem> = new Map<string, ConfigurationItem>();

  /**
   * 获取配置组件
   * @param type
   */
  public getConfiguration(type: string) {
    const item = this.configurations.get(type);
    return item?.component || null
  }

  /**
   * 注册配组件
   * @param type
   * @param component
   */
  public setConfiguration(type: string, component: React.ComponentType) {
    this.configurations.set(type, {
      component,
      type
    })
  }

}
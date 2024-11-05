const WILDCARD = '*'

class EventEmitter {
  public _events: Record<any, any>
  constructor() {
    this._events = {}
  }

  /**
   * 监听事件
   * @param evt
   * @param callback
   * @param once
   */
  public on(evt: string, callback: any, once?: boolean) {
    const evts = evt.split(',')
    evts.forEach((ev) => {
      if (!this._events[ev]) {
        this._events[ev] = []
      }
      this._events[ev].push({
        callback,
        once: !!once
      })
    })

    return this
  }

  /**
   * 监听一个事件一次
   * @param evt
   * @param callback
   */
  public once(evt: string, callback: any) {
    return this.on(evt, callback, true)
  }

  /**
   * 触发一个事件
   * @param evt
   * @param args
   */
  public emit(evt: string | number, eventArgs: any) {
    const events = this._events[evt] || []
    const wildcardEvents = this._events[WILDCARD] || []

    // 实际的处理 emit 方法
    const doEmit = (es: any[]) => {
      let { length } = es
      for (let i = 0; i < length; i++) {
        if (!es[i]) {
          // eslint-disable-next-line no-continue
          continue
        }
        const { callback, once } = es[i]

        if (once) {
          es.splice(i, 1)

          if (es.length === 0) {
            delete this._events[evt]
          }

          length--
          i--
        }

        callback.apply(this, [eventArgs])
      }
    }

    doEmit(events)
    doEmit(wildcardEvents)
  }

  /**
   * 取消监听一个事件，或者一个channel
   * @param evt
   * @param callback
   */
  public off(evt: string | number, callback: any) {
    if (!evt) {
      // evt 为空全部清除
      this._events = {}
    } else if (!callback) {
      // evt 存在，callback 为空，清除事件所有方法
      delete this._events[evt]
    } else {
      // evt 存在，callback 存在，清除匹配的
      const events = this._events[evt] || []

      let { length } = events
      for (let i = 0; i < length; i++) {
        if (events[i].callback === callback) {
          events.splice(i, 1)
          length--
          i--
        }
      }

      if (events.length === 0) {
        delete this._events[evt]
      }
    }

    return this
  }

  /* 当前所有的事件 */
  public getEvents() {
    return this._events
  }
}

export { EventEmitter }

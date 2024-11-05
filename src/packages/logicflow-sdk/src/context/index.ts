import { EventEmitter } from './EventEmitter';
import History from './history';

export default class Context {
  public history: History;
  public eventCenter: EventEmitter;
  public logicList: any;
  constructor(options: { logicList: any; }) {
    this.eventCenter = new EventEmitter();
    this.history = new History(); // 操作记录

    this.logicList = options.logicList;
  }
}
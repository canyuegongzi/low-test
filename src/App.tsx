import './App.css';
import {LogicPanel} from "./packages/logicflow-sdk/src";
import {useEffect} from "react";
import {runner} from "./packages/logicflow-render/src";
import {isJSExpression} from "./packages/utils/src/is-jsexpression.ts";
import {parseData} from "./packages/utils/src/parse-data";
import axios from "axios";

const data ={
  "nodes": [
    {
      "id": "logic_70iomj3oc100000",
      "type": "CommonNode",
      "x": 920,
      "y": 200,
      "properties": {
        "label": "条件允许",
        "value": "Condition",
        "logo": "https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_load.png",
        "__config__": {
          "type": "CommonNode",
          "aliasType": "Condition",
          "correlationId": "",
          "isAllowAsTargetNode": true
        },
        "name": "条件判断",
        "status": "normal",
        "biz": {
          "value": {
            "relation": "OR",
            "conditions": [
              {
                "relation": "AND",
                "conditions": [],
                "value": [
                  {
                    "operate": "=",
                    "source": {
                      "type": "string",
                      "value": {
                        "type": "JSExpression",
                        "value": "this.state.title"
                      },
                      "valueType": "pageState"
                    },
                    "target": {
                      "valueType": "input",
                      "value": "sssss"
                    }
                  }
                ]
              }
            ],
            "value": []
          },
          "onFailureConfig": {
            "continueOnFailure": false
          },
          "name": "条件允许"
        },
        "width": 100,
        "height": 54
      }
    },
    {
      "id": "logic_b5433p4vuv40000",
      "type": "StartNode",
      "x": 720,
      "y": 200,
      "properties": {
        "label": "页面加载",
        "value": "PageInit",
        "logo": "https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png",
        "__config__": {
          "type": "StartNode",
          "aliasType": "PageInitNode",
          "isAllowAsTargetNode": false,
          "correlationId": "componentDidMount"
        },
        "name": "页面加载",
        "status": "normal",
        "width": 100,
        "height": 54
      }
    },
    {
      "id": "logic_6jgje7obh4o0000",
      "type": "CommonNode",
      "x": 1100,
      "y": 200,
      "properties": {
        "label": "请求数据",
        "value": "DataSource",
        "logo": "https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_load.png",
        "__config__": {
          "type": "CommonNode",
          "aliasType": "DataSource",
          "correlationId": "",
          "isAllowAsTargetNode": true
        },
        "name": "请求数据",
        "status": "normal",
        "biz": {
          "value": {
            "requestName": "测试接口",
            "requestMethod": "GET",
            "requestUrl": "https://npm.elemecdn.com/shiki-es/dist/assets/themes/github-light.json",
            "paramsList": [],
            "bodyList": [],
            "dataFetchMode": "custom"
          },
          "onFailureConfig": {
            "continueOnFailure": false
          },
          "name": "请求数据"
        },
        "width": 100,
        "height": 54
      }
    },
    {
      "id": "logic_fb1ttbrqwyo0000",
      "type": "CommonNode",
      "x": 1280,
      "y": 200,
      "properties": {
        "label": "请求成功",
        "value": "Condition",
        "logo": "https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_load.png",
        "__config__": {
          "type": "CommonNode",
          "aliasType": "Condition",
          "correlationId": "",
          "isAllowAsTargetNode": true
        },
        "name": "条件判断",
        "status": "normal",
        "biz": {
          "value": {
            "relation": "OR",
            "conditions": [
              {
                "relation": "AND",
                "conditions": [],
                "value": [
                  {
                    "operate": "=",
                    "source": {
                      "type": "string",
                      "value": {
                        "type": "JSExpression",
                        "value": "this.state.obj.name"
                      },
                      "valueType": "pageState"
                    },
                    "target": {
                      "type": "undefined",
                      "value": "name",
                      "valueType": "input"
                    }
                  }
                ]
              }
            ],
            "value": []
          },
          "onFailureConfig": {
            "continueOnFailure": false
          },
          "name": "请求成功"
        },
        "width": 100,
        "height": 54
      }
    },
    {
      "id": "logic_d5lqhjy1q540000",
      "type": "CommonNode",
      "x": 1280,
      "y": 280,
      "properties": {
        "label": "请求失败",
        "value": "Condition",
        "logo": "https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_load.png",
        "__config__": {
          "type": "CommonNode",
          "aliasType": "Condition",
          "correlationId": "",
          "isAllowAsTargetNode": true
        },
        "name": "条件判断",
        "status": "normal",
        "biz": {
          "value": {
            "relation": "OR",
            "conditions": [],
            "value": []
          },
          "onFailureConfig": {
            "continueOnFailure": false
          },
          "name": "请求失败"
        },
        "width": 100,
        "height": 54
      }
    }
  ],
  "edges": [
    {
      "id": "9770373d-6d1d-43ee-813c-363098dfbef5",
      "type": "LogicLine",
      "properties": {},
      "sourceNodeId": "logic_b5433p4vuv40000",
      "targetNodeId": "logic_70iomj3oc100000",
      "startPoint": {
        "x": 770,
        "y": 200
      },
      "endPoint": {
        "x": 870,
        "y": 200
      },
      "pointsList": [
        {
          "x": 770,
          "y": 200
        },
        {
          "x": 870,
          "y": 200
        }
      ]
    },
    {
      "id": "d5d00744-3f9d-4720-86dc-878604bdd918",
      "type": "LogicLine",
      "properties": {},
      "sourceNodeId": "logic_70iomj3oc100000",
      "targetNodeId": "logic_6jgje7obh4o0000",
      "startPoint": {
        "x": 970,
        "y": 200
      },
      "endPoint": {
        "x": 1050,
        "y": 200
      },
      "pointsList": [
        {
          "x": 970,
          "y": 200
        },
        {
          "x": 1050,
          "y": 200
        }
      ]
    },
    {
      "id": "df0407bc-c9de-489a-8473-1d415d0e898a",
      "type": "LogicLine",
      "properties": {},
      "sourceNodeId": "logic_6jgje7obh4o0000",
      "targetNodeId": "logic_fb1ttbrqwyo0000",
      "startPoint": {
        "x": 1150,
        "y": 200
      },
      "endPoint": {
        "x": 1230,
        "y": 200
      },
      "pointsList": [
        {
          "x": 1150,
          "y": 200
        },
        {
          "x": 1230,
          "y": 200
        }
      ]
    },
    {
      "id": "1ebe4554-6a2e-4f23-9588-c9b5f4408ac1",
      "type": "LogicLine",
      "properties": {},
      "sourceNodeId": "logic_6jgje7obh4o0000",
      "targetNodeId": "logic_d5lqhjy1q540000",
      "startPoint": {
        "x": 1150,
        "y": 200
      },
      "endPoint": {
        "x": 1230,
        "y": 280
      },
      "pointsList": [
        {
          "x": 1150,
          "y": 200
        },
        {
          "x": 1180,
          "y": 200
        },
        {
          "x": 1180,
          "y": 280
        },
        {
          "x": 1230,
          "y": 280
        }
      ]
    }
  ]
}

const consts = {
  "device": [
    {
      "name": "device",
      "path": "this.constants.device",
      "sourceCode": "this.constants.device",
      "value": "this.constants.device",
      "children": [
        {
          "name": "viewport",
          "path": "this.constants.device.viewport",
          "sourceCode": "this.constants.device.viewport",
          "value": "this.constants.device.viewport",
          "children": [
            {
              "name": "width",
              "path": "this.constants.device.viewport.width",
              "sourceCode": "this.constants.device.viewport.width",
              "value": "this.constants.device.viewport.width"
            },
            {
              "name": "height",
              "path": "this.constants.device.viewport.height",
              "sourceCode": "this.constants.device.viewport.height",
              "value": "this.constants.device.viewport.height"
            }
          ]
        }
      ]
    }
  ],
  "router": [
    {
      "name": "router",
      "path": "this.constants.router",
      "sourceCode": "this.constants.router",
      "value": "this.constants.router",
      "children": [
        {
          "name": "params",
          "path": "this.constants.router.params",
          "sourceCode": "this.constants.router.params",
          "value": "this.constants.router.params",
          "children": [
            {
              "name": "pageId",
              "path": "this.constants.router.params.pageId",
              "sourceCode": "this.constants.router.params.pageId",
              "value": "this.constants.router.params.pageId"
            },
            {
              "name": "pageVersionId",
              "path": "this.constants.router.params.pageVersionId",
              "sourceCode": "this.constants.router.params.pageVersionId",
              "value": "this.constants.router.params.pageVersionId"
            },
            {
              "name": "pageName",
              "path": "this.constants.router.params.pageName",
              "sourceCode": "this.constants.router.params.pageName",
              "value": "this.constants.router.params.pageName"
            },
            {
              "name": "token",
              "path": "this.constants.router.params.token",
              "sourceCode": "this.constants.router.params.token",
              "value": "this.constants.router.params.token"
            }
          ]
        }
      ]
    }
  ]
}


const pageInstance = {
  state: {
    title: "sssss",
    obj: {
      age: 23,
      name: "name"
    }
  },
  setState: (state: Record<any, any>) => {
    console.log(state)
    const that: any = this;
    that.state = {...(that?.state || {}), ...state}
  },
  utils: {
    isJSExpression,
    parseData,
    request: axios
  }
}
const App = () => {
  useEffect(() => {
    console.log(data);
    void runner.execute(data, {
      pageInstance: pageInstance
    }).then(() => {
      console.log("success")
    })
  }, [])
  return (
    <div style={{width: '100%', height: '100%', overflow: 'hidden'}}>
      <LogicPanel
        graphData={data}
        renderRefInstance={pageInstance}
        config={{
          pageLifeCycleNodes: [
            {
              label: '页面加载',
              value: 'PageInit',
              logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png',
              __config__: {
                type: 'StartNode',
                aliasType: 'PageInitNode',
                isAllowAsTargetNode: false,
                correlationId: 'componentDidMount'
              }
            },
            {
              label: '页面卸载',
              value: 'PageUnmount',
              logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png',
              __config__: {
                type: 'StartNode',
                aliasType: 'PageUnmountNode',
                isAllowAsTargetNode: false,
                correlationId: 'componentWillUnmount'
              }
            }
          ],
          pageUtilsNodes: [
            {
              label: '请求数据',
              value: 'DataSource',
              logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_load.png',
              __config__: {
                type: "CommonNode",
                aliasType: "DataSource",
                correlationId: "",
                isAllowAsTargetNode: true
              }
            },
            {
              label: '页面跳转',
              value: 'PageJump',
              logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_jump.png',
              __config__: {
                type: "CommonNode",
                aliasType: "PageJump",
                correlationId: "",
                isAllowAsTargetNode: true
              }
            },
            {
              label: '数据转换',
              value: 'DataConvert',
              logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_trans.png',
              __config__: {
                type: "CommonNode",
                aliasType: "DataConvert",
                correlationId: "",
                isAllowAsTargetNode: true
              }
            }
          ],
          conditionUtilsNodes: [
            {
              label: '条件判断',
              value: 'Condition',
              logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_load.png',
              __config__: {
                type: "CommonNode",
                aliasType: "Condition",
                correlationId: "",
                isAllowAsTargetNode: true
              }
            }
          ],
          componentsTree: [
            {
              "thumb": "https://qiniu.canyuegongzi.xyz/lowcode_component/static/normal-component-logo.png",
              "id": "95",
              "componentId": 95,
              "alias": "低代码PAGE",
              "name": "lowcode-page",
              "componentName": "Page",
              "latest": "1.0.0",
              "version": "1.0.0",
              "props": {},
              "dependencies": {
                "lowcode-page": "1.0.0"
              },
              "componentType": [
                "Component",
                "Page",
                "Container"
              ],
              "sourceCode": "\nclass LowcodeComponent extends Component {\n  state = {\n    block: false,\n    title: \"测试文案gfdgfhfhfhfhffh\",\n    title1: \"测试文案gfdgfhfhfhfhffh\",\n    title2: \"测试文案gfdewewerwfh\",\n    title3: \"测试文案gfdgqqqqq\"\n  }\n\n  componentDidMount() {}\n\n  componentWillUnmount() {}\n}",
              "children": [
                {
                  "alias": "特征文字",
                  "children": [],
                  "componentId": "93",
                  "componentName": "CharacteristicTextList",
                  "exportName": "CharacteristicTextList",
                  "css": "",
                  "dependencies": {
                    "characteristic-text-list": "1.0.2"
                  },
                  "desc": "特征文字",
                  "id": "UEge8qFbT80YKDKfsxu_O",
                  "latest": "1.0.2",
                  "lifeCycles": {},
                  "name": "characteristic-text-list",
                  "props": {
                    "titleConfig": {
                      "text": {
                        "type": "JSExpression",
                        "value": "this.state.title1",
                        "mock": {
                          "type": "JSExpression",
                          "value": "this.state.title1",
                          "mock": {
                            "type": "JSExpression",
                            "value": "this.state.title",
                            "mock": "标题"
                          }
                        }
                      },
                      "fontSize": "40",
                      "fontColor": "#000"
                    },
                    "subTitleConfig": {
                      "text": "标题",
                      "fontSize": "16",
                      "fontColor": "#959ba6"
                    },
                    "list": [
                      {
                        "backgroundImage": "https://tianshu.alicdn.com/9652b6f7-8bc9-4527-9854-06c59f2b0bc8.png",
                        "description": "标题",
                        "fontSize": "16",
                        "fontColor": "#000",
                        "width": "90"
                      }
                    ]
                  },
                  "thumb": "https://qiniu.canyuegongzi.xyz/lowcode_component/static/normal-component-logo.png",
                  "version": "1.0.2",
                  "componentType": [
                    "Component"
                  ]
                },
                {
                  "alias": "特征文字",
                  "children": [],
                  "componentId": "93",
                  "componentName": "CharacteristicTextList",
                  "exportName": "CharacteristicTextList",
                  "css": "",
                  "dependencies": {
                    "characteristic-text-list": "1.0.2"
                  },
                  "desc": "特征文字",
                  "id": "RTJ38MKlqaiJJuky1hy2l",
                  "latest": "1.0.2",
                  "lifeCycles": {},
                  "name": "characteristic-text-list",
                  "props": {
                    "titleConfig": {
                      "text": {
                        "type": "JSExpression",
                        "value": "this.state.title2",
                        "mock": {
                          "type": "JSExpression",
                          "value": "this.state.title",
                          "mock": "标题"
                        }
                      },
                      "fontSize": "40",
                      "fontColor": "#000"
                    },
                    "subTitleConfig": {
                      "text": "标题",
                      "fontSize": "16",
                      "fontColor": "#959ba6"
                    },
                    "list": [
                      {
                        "backgroundImage": "https://tianshu.alicdn.com/9652b6f7-8bc9-4527-9854-06c59f2b0bc8.png",
                        "description": "标题",
                        "fontSize": "16",
                        "fontColor": "#000",
                        "width": "90"
                      }
                    ]
                  },
                  "thumb": "https://qiniu.canyuegongzi.xyz/lowcode_component/static/normal-component-logo.png",
                  "version": "1.0.2",
                  "componentType": [
                    "Component"
                  ]
                },
                {
                  "alias": "特征文字",
                  "children": [],
                  "componentId": "93",
                  "componentName": "CharacteristicTextList",
                  "exportName": "CharacteristicTextList",
                  "css": "",
                  "dependencies": {
                    "characteristic-text-list": "1.0.2"
                  },
                  "desc": "特征文字",
                  "id": "LgQGWJh2cckIx89PvNLCN",
                  "latest": "1.0.2",
                  "lifeCycles": {},
                  "name": "characteristic-text-list",
                  "props": {
                    "titleConfig": {
                      "text": {
                        "type": "JSExpression",
                        "value": "this.state.title3",
                        "mock": {
                          "type": "JSExpression",
                          "value": "this.state.title",
                          "mock": "标题"
                        }
                      },
                      "fontSize": "40",
                      "fontColor": "#000"
                    },
                    "subTitleConfig": {
                      "text": "标题",
                      "fontSize": "16",
                      "fontColor": "#959ba6"
                    },
                    "list": [
                      {
                        "backgroundImage": "https://tianshu.alicdn.com/9652b6f7-8bc9-4527-9854-06c59f2b0bc8.png",
                        "description": "标题",
                        "fontSize": "16",
                        "fontColor": "#000",
                        "width": "90"
                      }
                    ]
                  },
                  "thumb": "https://qiniu.canyuegongzi.xyz/lowcode_component/static/normal-component-logo.png",
                  "version": "1.0.2",
                  "componentType": [
                    "Component"
                  ]
                }
              ],
              "lifeCycles": {
                "componentDidMount": {
                  "type": "JSFunction",
                  "value": "function componentDidMount() { }\n"
                },
                "componentWillUnmount": {
                  "type": "JSFunction",
                  "value": "function componentWillUnmount() { }\n"
                }
              },
              "state": {
                "block": {
                  "type": "JSExpression",
                  "value": "false"
                },
                "title": {
                  "type": "JSExpression",
                  "value": "\"测试文案gfdgfhfhfhfhffh\""
                },
                "title1": {
                  "type": "JSExpression",
                  "value": "\"测试文案gfdgfhfhfhfhffh\""
                },
                "title2": {
                  "type": "JSExpression",
                  "value": "\"测试文案gfdewewerwfh\""
                },
                "title3": {
                  "type": "JSExpression",
                  "value": "\"测试文案gfdgqqqqq\""
                }
              },
              "methods": {}
            }
          ] as any,
          defaultConfig: {
            start: {
              label: '组件',
              value: 'ComponentNode',
              logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png',
              __config__: {
                type: 'StartNode',
                aliasType: 'ComponentNode',
                isAllowAsTargetNode: true
              }
            }
          },
          variableProvideConfig: {
            pageStates: [
              {
                "name": "title",
                "path": "this.state.title",
                "sourceCode": "this.state.title",
                "value": "this.state.title"
              },
              {
                "name": "obj",
                "path": "this.state.obj",
                "sourceCode": "this.state.obj",
                "value": "this.state.obj",
                "children": [
                  {
                    "name": "age",
                    "path": "this.state.obj.age",
                    "sourceCode": "this.state.obj.age",
                    "value": "this.state.obj.age"
                  },
                  {
                    "name": "name",
                    "path": "this.state.obj.name",
                    "sourceCode": "this.state.obj.name",
                    "value": "this.state.obj.name"
                  }
                ]
              }
            ],
            pageMethods: [],
            systemDevice: () => {
              return consts.device
            },
            systemRouterParams: () => {
              return consts.router
            }
          }
        }}
        viewAuth={{
          toolsControl: true,
          nodeList: true
        }}

      />
    </div>
  );
};

export default App;

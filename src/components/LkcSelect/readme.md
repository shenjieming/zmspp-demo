# LkcSelect

### 特点

* 组件内部一律使用`labelInValue`，所以`value`必须为对象。

* 组件自动查询，渲染下拉选框

* 当组件生成时, 会自动执行一次keywords为空的查询

* 如果你需要使用onSelect事件, 则optionConfig为必传, 否则会报错

* onSelect事件的第二个参数与antd组件不同, 现为渲染这个Option的数据

### 默认属性和dome：

默认属性：

```javascript
optionLabelProp: 'title',
allowClear: true,
showSearch: true,
filterOption: false,
placeholder: '请输入关键字',
notFoundContent: requesting ? <Spin size="small" /> : '无匹配内容',
getPopupContainer: () => {
  const layout = document.querySelector('.aek-layout')

  if (layout) {
    return layout
  }
  return document.querySelector('body')
},
```

Dome:

```javascript
<LkcSelect
  url="/contacts/option/suppliers"
  optionConfig={{
    idStr: 'supplierOrgId',
    nameStr: 'supplierOrgName',
    prefix: '供应商',
  }}
/>
```

### API

| 参数             | 说明                                                           | 类型                                                        | 默认值         |
| ---------------- | -------------------------------------------------------------- | ----------------------------------------------------------- | -------------- |
| contentRender    | 当后端返回数据不是数组的话，需将其转换为Option有效数组         | fun                                                         | _ => _         |
| url              | 请求地址                                                       | string 或 obj{ url, type: 'get', perfix: ('rap', 'mock')  } |                |
| value            | 例：{ key: '1', label: '2' }                                   | obj                                                         |                |
| transformPayload | 有些异步请求不只传keywords，或固定查询条件（只请求一次）时使用 | obj                                                         |                |
| optionConfig     | getOption的第二个参数                                          | obj                                                         |                |
| modeType             | 为'select'时数据只查询一次    | string                                                      |  |

其他API同官方`Select`的API

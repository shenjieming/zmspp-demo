## GetFormItem

### 提醒：

下个项目中，此组件整合Form，外部无需再用Form标签包裹，不再是单纯的FormItem组件，将改名为LkcForm，获取form的方法为`LkcForm.create()(PageComponent)`，也可提供`getPropsForm`函数（参照`SearchFormFilter`组件，当页面组价已被其他`Form.create`占用时使用）。

### API

| 参数     | 说明                   | 类型       | 默认值 |
| -------- | ---------------------- | ---------- | ------ |
| allView  | 将整个表单转换为查看态 | booler     | false  |
| style    |                        | object     |        |
| formData | 表单组件数据，详见下述 | array[obj] |        |

#### formData(ArrayItem) API

| 参数       | 说明                                      | 类型                         | 默认值 |
| ---------- | ----------------------------------------- | ---------------------------- | ------ |
| label      |                                          | string                       |        |
| field      | getFieldDecorator第一个参数，查看态可不填 | string                       |        |
| options    | getFieldDecorator第二个参数               | obj                          |        |
| layout     |                                           | object                       |        |
| exclude    | 是否排除此FormItem                        | booler                       |        |
| style      | 作用于Col标签                             | array[obj]                   |        |
| width      | 优先级比col高                             | number\| string              |        |
| col        |                                           | number\| array[<=md, lg, xl] | 24     |
| view       | 优先级低于allView                          | booler             |        |
| viewRender |  同Table的render                          | fun(initialValue, initValueObj)|    defaultViewRender    |
| otherProps | 作用于FormItem、ViewFormItem标签上的其他属性            | object                       |        |
| component  | obj时: { name, props }                    | obj\|ReactNode               |        |
|otherContent| FormItem下除component之外的其他节点        | obj\|ReactNode               |        |

##### formData提醒

* formData的ArrayItem中style作用于Col标签，同级别的otherProps中也可以写style，但作用于FormItem标签和ViewFormItem标签；

* formData中的元素支持直接插入标签（false不显示，所以实现exclude效果可用：flag && \<div /\>），但此标签必须独立占据一行。如果想紧跟在表单元素之后，可使用otherContent属性，但要注意layout的宽度，要为其留下足够的显示空间。

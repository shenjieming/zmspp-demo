## LkcForm

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
| view       | 优先级低于allView，为对象时，属性见下     | booler\| obj{type, render}   |        |
| otherProps | 作用于FormItem、ViewFormItem标签上的其他属性            | object                       |        |
| component  | obj时: { name, props }                    | obj\|ReactNode               |        |

##### view为对象时

| 参数    | 说明                     | 类型   | 默认值  |
| ------- | ------------------------ | ------ | ------ |
| render  | 同Table的render          | string |        |
| type    | 暂时只适配了'img'，待优化  | string |        |
| subside | 是否塌陷（无行高）         | bool   |  true  |

##### formData提醒

* formData的ArrayItem中style作用于Col标签，同级别的otherProps中也可以写style，但作用于FormItem标签和ViewFormItem标签；

* formData中的元素支持直接插入标签（false不显示，所以实现exclude效果可用：flag && \<div /\>），但此标签必须独立占据一行。如果想紧跟在表单元素之后，可使用otherContent属性，但要注意layout的宽度，要为其留下足够的显示空间。

* `view`中的`render`和`type`都是改变结果的属性，但并没有覆盖形式的优先级，数据流向为：`initialValue -> render -> type`，所以图片组件render后的值依然要根据type做一次相应的转换。

# 三个时间组件

## LkcDatePicker

同`DatePicker`组件，不同是value入参可为`momentDate`也可为`strDate`，Form从中获取的值的格式由属性`isMoment`决定，默认为字符串格式。

### API

| 参数       | 说明                                              | 类型                                                   | 默认值|
| -----------|---------------------------------------------------| -----------------------------------------------------| -----|
| value      |                                                   | oneOfType(string, moment)                             |      |
| isMoment   | 获取值是否为`moment`格式                           | booler                                                | false|
| onChange   |                                                   |  isMoment ? Fun(moment, string) : Fun(string, moment) |      |

其他参数同考antd的`DatePicker`

## LkcRangePicker

同`RangePicker`组件，作用同上。

### API

| 参数       | 说明                                              | 类型                                                              | 默认值|
| -----------|---------------------------------------------------| ------------------------------------------------------------------| -----|
| value      |                                                   | Array(oneOfType(string, moment))                                  |      |
| isMoment   | 获取值是否为`moment`格式                           | booler                                                            | false|
| onChange   |                                                   |  isMoment ? Fun(momentArr, stringArr) : Fun(stringArr, momentArr) |      |

其他参数同考antd的`RangePicker`

## TimeQuantum

两个`DatePicker`的拼接, 带时间限制。
为优化表单校验交互，组件内部做了一些`需要注意`的逻辑判断， 需要校验时：

* 需传入`isRequired`或`startRequired`参数供组件内部判断；

* `isRequired`时，填充第一个值（起始或结束）时，不会触发组件`onChange`，因此不会触发检验，但此时组件的值并未发生变化，依然是`undefined`；

* `startRequired`时，填充第一个值为结束值时（此时起始值为空），不会触发组件`onChange`，不会触发检验，组件的依然是`undefined`;

* 正因为如此，此组件`只能`用于表单中，否则`value`参数失效。

### 必填时，校验规则务必从下面中选取：

````js
// isRequired: true, 起始时间、结束时间都必填
{
  required: true,
  validator: (_, value, callback) => {
    if (!value) {
      callback('请选择时间段')
    } else if (!value[0]) {
      callback('请选择起始时间')
    } else if (!value[1]) {
      callback('请选择结束时间')
    }
    callback()
  },
}
````

````js
// startRequired: true, 仅起始时间必填
{
  required: true,
  validator: (_, value, callback) => {
    if (!value || !value[0]) {
      callback('请选择起始时间')
    }
    callback()
  },
}
````

### API

| 参数           | 说明                                                                                             | 类型                                                              | 默认值|
| ---------------|-------------------------------------------------------------------------------------------------| ------------------------------------------------------------------| -----|
| value          |                                                                                                 | Array(oneOfType(string, moment))                                  |      |
| isMoment       | 获取值是否为`moment`格式                                                                          | booler                                                            | false|
| onChange       |                                                                                                  |  isMoment ? Fun(momentArr, stringArr) : Fun(stringArr, momentArr) |      |
| commonProps    | 起始和结束`DatePicker`的共同参数(不能覆盖`onChange`、`value`、`showToday`、`disabledDate`、`style`) |    obj                                                            |      |
| startProps     | 起始`DatePicker`的其他参数(不能覆盖`onChange`、`value`、`showToday`、`disabledDate`、`style`)       |    obj                                                            |      |
| endProps       | 结束`DatePicker`的其他参数(不能覆盖`onChange`、`value`、`showToday`、`disabledDate`、`style`)       |    obj                                                            |      |
| isRequired     | `起始时间`和`结束时间`是否都必填                                                                    | booler                                                            | false|
| startRequired  | 是否仅`起始时间`必填                                                                               | booler                                                            | false|
| timeDifference | 默认时间差                                                                                        | Array(yearNum, monthNum, dayNum), 例：[4, 0, -1]                   |      |
| style   |                                                                                                         |       obj                                                          |      |

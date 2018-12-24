# LkcTable

### 特点

* 实现antd-design表格表头的动态配置，如（更换表头位置和配置列宽，控制需要显示的列）


### 默认属性：

#### Columns属性
* 默认属性：保持和antd的table Columns参数一致
* 不同点： 需要在配置列加上headConfigFlag字段，bool类型  默认是false
#### Table属性

* 默认属性： 保持和antd的table Table参数一致
* 不同点： 增加handleSave方法,


Dome:

```javascript
<LkcTable
  columns={[{
    title: '姓名'
    key: 'name',
    dataIndex: 'name',
  }, {
    title: '性别',
    key: 'gender',
    dataIndex: 'gender',
  }, {
    headConfigFlag: true,
    key: '',
    dataIndex: '',
    title: '' // 可为空
  }]}
  dataSource={[
    {
      name: '张三',
      gender: '男',
    },
  ]}
  bordered={true}
  /**
   * data 为配置之后的Columns数组
   */
  handleSave={(data) => {
    const obj = {
      config: {
        supplyCatalogue: data,
      },
    }
    localStorage.setItem(user.userId, JSON.stringify(obj))
  }}
/>
```


# LkcLightBox

### 特点

* 图片查看器，支持pdf和图片的在线查看。
* 支持图片的放大、缩小、正旋转和反旋转(不支持pdf的放大缩小和旋转)。

### dome：

```javascript
<LkcLightBox
  isOpen={true}
  url='http://aek-test-image.b0.upaiyun.com/userImage/2017_10_27/08_35_25_l9f13nfsbce5zpzjhswqtwalxybg5bhy.pdf,http://aek-test-image.b0.upaiyun.com/userImage/2017_10_10/05_37_27_q9thzaq9g48pwbr5bkayax6gn72acjxf.jpg!watermark'
  onCancel={() => {
    dispatch({
      type: 'updateState',
      payload: {
        isOpen: false,
      },
    })
  }}
  imageDetail={(<p>测试数据</p>)}
/>
```

### API

| 参数             | 说明                                                           | 类型                                                        | 默认值         |
| ---------------- | -------------------------------------------------------------- | ----------------------------------------------------------- | -------------- |
|isOpen            |   图片查看器的开关(必传)        |  Boolean       |  false
|url               |   图片的的地址，以逗号隔开(必传) |  String        |             |
|onCancel      |   关闭图片查看器函数(必传)       |  Func          |             |
|imageDetail       |   证件详情(非必传)                |  node           |            |
|photoIndex         |  图片序号(非必传)                 | number           |   0       |

import React from 'react'
import PropTypes from 'prop-types'
import PackageSpecifica from '../../../components/PackageSpecifica'

const Package = ({
  packageList,
  packageModalVisible,
  dispatch,
  effects,
  packageUnit,
  rowSelectData,
}) => {
  const packageProps = {
    modalVisible: packageModalVisible, // 弹框visible
    handleModalCancel() {
      dispatch({ type: 'supplyCatalogueDetail/updateState', payload: { packageModalVisible: false } })
    }, //  modal 关闭事件
    handleModalOk(list = []) {
      dispatch({
        type: 'supplyCatalogueDetail/setPackageList',
        payload: {
          pscId: rowSelectData.pscId,
          data: list,
        },
      })
    }, // modal 保存事件
    packageUnit, // 包装规格所有单位
    packageList, // 渲染表格数据
    loading: !!effects['supplyCatalogueDetail/setPackageList'], // 提交loading
  }
  return (
    <PackageSpecifica {...packageProps} />
  )
}
Package.propTypes = {
  dispatch: PropTypes.func,
  effects: PropTypes.object,
  packageList: PropTypes.object,
  packageModalVisible: PropTypes.bool,
  packageUnit: PropTypes.array,
  rowSelectData: PropTypes.object,
}
export default Package

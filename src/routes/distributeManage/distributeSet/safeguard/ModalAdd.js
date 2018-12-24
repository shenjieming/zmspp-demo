import React from 'react'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import { Modal, Table, Button } from 'antd'
import { SearchFormFilter } from '../../../../components'
import { getModalColumns, searchForm } from './data'
import style from './style.less'

const propTypes = {
  modalVisible: PropTypes.bool,
  modalTableData: PropTypes.array,
  pscIdArr: PropTypes.array,
  pagination: PropTypes.object,
  rowSelection: PropTypes.object,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onSearch: PropTypes.func,
  afterClose: PropTypes.func,
  addForModal: PropTypes.func,
  getPropsForm: PropTypes.func,
  rowSelectChange: PropTypes.func,
  modalInitValue: PropTypes.object,
  form: PropTypes.object,
  distributeType: PropTypes.number,
  priceChange: PropTypes.func,
}

const ModalAdd = ({
  modalVisible,
  modalTableData,
  pagination,
  rowSelectChange,
  loading,
  pscIdArr,
  onCancel,
  onSearch,
  distributeType,
  afterClose,
  getPropsForm,
  addForModal,
  priceChange = noop,
}) => {
  const modalOpts = {
    title: '添加物料',
    visible: modalVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    footer: null,
    onCancel,
    afterClose,
    width: 800,
  }
  const tableProps = {
    bordered: true,
    loading,
    pagination,
    dataSource: modalTableData || [],
    rowKey: 'pscId',
    columns: getModalColumns({ distributeType, priceChange }),
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: pscIdArr,
      onChange: rowSelectChange,
      getCheckboxProps: ({ unAddedFlag }) => ({ disabled: !unAddedFlag }),
    },
    rowClassName: ({ unAddedFlag }) => {
      if (!unAddedFlag) {
        return 'aek-text-disable'
      }
      return undefined
    },
  }
  const idLength = pscIdArr.length
  return (
    <Modal {...modalOpts}>
      <div className={style.search}>
        <SearchFormFilter
          getPropsForm={getPropsForm}
          formData={searchForm}
          loading={loading}
          onSearch={onSearch}
        />
        <Button
          type="primary"
          size="large"
          disabled={!idLength}
          loading={loading}
          onClick={() => {
            addForModal()
          }}
        >
          {idLength ? `添加物料(${idLength})` : '添加物料'}
        </Button>
      </div>
      <Table {...tableProps} />
    </Modal>
  )
}

ModalAdd.propTypes = propTypes

export default ModalAdd

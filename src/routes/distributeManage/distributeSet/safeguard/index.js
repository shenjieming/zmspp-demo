import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Modal } from 'antd'
import { aekConnect, getPagination, getCurrent } from '../../../../utils'
import { SearchFormFilter, ContentLayout } from '../../../../components'
import { searchForm, getColumns } from './data'
import ModalAdd from './ModalAdd'
import style from './style.less'

const propTypes = {
  toAction: PropTypes.func,
  getLoading: PropTypes.func,
  safeguard: PropTypes.object,
}

function Safeguard({
  toAction,
  getLoading,
  safeguard: {
    tableData,
    searchKeys,
    pageConfig,
    modalVisible,
    modalTableData,
    modalPageConfig,
    modalSearchKeys,
    pscIdArr,
    pscItemArr,
    modalForm,
    distributeType,
  },
}) {
  const modalAddProps = {
    distributeType,
    priceChange: (row, price) => {
      row.distributorPrice = price
      toAction({})
    },
    modalVisible,
    modalTableData,
    pscIdArr,
    pagination: getPagination(modalPageConfig, (current, pageSize) => {
      toAction(
        {
          ...modalSearchKeys,
          current,
          pageSize,
        },
        'pageModalList',
      )
    }),
    loading: getLoading('pageModalList'),
    rowSelectChange(selectedRowKeys, selectedRows) {
      toAction({ pscIdArr: selectedRowKeys, pscItemArr: selectedRows })
    },
    onCancel() {
      toAction({ modalVisible: false })
    },
    afterClose() {
      toAction({
        modalTableData: [],
        pscIdArr: [],
        pscItemArr: [],
      })
      if (modalForm.resetFields) {
        modalForm.resetFields()
      }
    },
    getPropsForm(formObj) {
      toAction({ modalForm: formObj })
    },
    onSearch(value) {
      toAction(
        {
          ...value,
          current: 1,
          pageSize: 10,
        },
        'pageModalList',
      )
    },
    addForModal() {
      toAction(
        {
          catalogList: pscItemArr.map(({ distributorPrice, pscId }) => ({
            distributorPrice,
            pscId,
          })),
        },
        'addPscs',
      ).then(() => {
        toAction('pageList')
        toAction(
          {
            ...modalSearchKeys,
            current: getCurrent(modalPageConfig, pscIdArr.length),
          },
          'pageModalList',
        )
        toAction({ pscIdArr: [] })
      })
    },
  }
  const tableProps = {
    bordered: true,
    loading: getLoading('pageList'),
    dataSource: tableData || [],
    pagination: getPagination(pageConfig, (current, pageSize) => {
      toAction(
        {
          ...searchKeys,
          current,
          pageSize,
        },
        'pageList',
      )
    }),
    rowKey: 'pscId',
    columns: getColumns({
      delPsc: (pscId) => {
        Modal.confirm({
          title: '操作提醒',
          content: '您确定要移除该目录？',
          onOk() {
            toAction({ pscId }, 'delPsc').then(() => {
              toAction(
                {
                  ...searchKeys,
                  current: getCurrent(pageConfig),
                },
                'pageList',
              )
            })
          },
        })
      },
      distributeType,
      startEditing: (row) => {
        row.editing = true
        toAction({})
      },
      changePrice: (row, distributorPrice) => {
        toAction({ row, distributorPrice }, 'changePscPrice')
      },
    }),
  }
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    content: (
      <div>
        <div className={style.search}>
          <SearchFormFilter
            formData={searchForm}
            loading={getLoading('pageList')}
            onSearch={(value) => {
              toAction(
                {
                  current: 1,
                  pageSize: 10,
                  ...value,
                },
                'pageList',
              )
            }}
          />
          <Button
            type="primary"
            size="large"
            onClick={() => {
              toAction({ modalVisible: true })
              toAction(
                {
                  current: 1,
                  pageSize: 10,
                  keywords: null,
                },
                'pageModalList',
              )
            }}
          >
            添加物料
          </Button>
        </div>
        <Table {...tableProps} />
        <ModalAdd {...modalAddProps} />
      </div>
    ),
  }
  return <ContentLayout {...contentLayoutProps} />
}

Safeguard.propTypes = propTypes
export default aekConnect()(Safeguard)

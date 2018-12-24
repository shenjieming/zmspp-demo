import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Breadcrumb, SearchFormFilter } from '../../../components'
import { getBasicFn, getPagination, getOption } from '../../../utils'

const namespace = 'materialCompare'
const propTypes = {
  materialCompare: PropTypes.object,
  loading: PropTypes.object,
}
const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const IndexPage = ({ materialCompare, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { materialMainList, pagination, searchSaveParam } = materialCompare
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      className: 'aek-text-center',
      render: (text, record, idx) => idx + 1,
    },
    {
      title: '物资名称',
      dataIndex: 'materialsName',
      key: 'materialsName',
    },
    {
      title: '单位/规格型号',
      dataIndex: 'skuUnitText',
      key: 'skuUnitText',
      render: (text, { materialsSku }) =>
        (!text && !materialsSku ? (
          ''
        ) : (
          <span>
            <p>{text || <span>&nbsp;</span>}</p>
            <p>{materialsSku || <span>&nbsp;</span>}</p>
          </span>
        )),
    },
    {
      title: '厂家/注册证',
      dataIndex: 'factoryName',
      key: 'factoryName',
      render: (text, { certificateNo }) =>
        (!text && !certificateNo ? (
          ''
        ) : (
          <span>
            <p>{text || <span>&nbsp;</span>}</p>
            <p>{certificateNo || <span>&nbsp;</span>}</p>
          </span>
        )),
    },
    {
      title: '买方/卖方',
      dataIndex: 'customerOrgName',
      key: 'customerOrgName',
      render: (text, { supplierOrgName }) =>
        (!text && !supplierOrgName ? (
          ''
        ) : (
          <span>
            <p>{text || <span>&nbsp;</span>}</p>
            <p>{supplierOrgName || <span>&nbsp;</span>}</p>
          </span>
        )),
    },
    {
      title: '状态',
      dataIndex: 'compareFlag',
      key: 'compareFlag',
      render: text => (text ? '已对照' : '待对照'),
    },
    {
      title: '业务发生时间',
      dataIndex: 'businessTime',
      key: 'businessTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (text, { compareFlag, deliverItemId }) => {
        const showText = compareFlag ? '重新对照' : '对照'
        return (
          <Link to={`/materials/materialCompare/materialCompareDetail/${deliverItemId}`}>{showText}</Link>
        )
      },
    },
  ]
  const searchParams = {
    initialValues: searchSaveParam,
    onSearch(data) {
      dispatchAction({
        payload: { searchSaveParam: data },
      })
      dispatchAction({
        type: 'getMainList',
        payload: { ...pagination, current: 1 },
      })
    },
    formData: [
      {
        layout: noLabelLayout,
        field: 'compareFlag',
        width: 220,
        component: {
          name: 'Select',
          props: {
            optionLabelProp: 'title',
            children: getOption(
              [
                {
                  id: null,
                  name: '全部',
                },
                {
                  id: '1',
                  name: '已对照',
                },
                {
                  id: '0',
                  name: '待对照',
                },
              ],
              { prefix: '状态' },
            ),
          },
        },
        options: {
          initialValue: '0',
        },
      },
      {
        layout: noLabelLayout,
        field: 'customerOrgId',
        width: 220,
        component: {
          name: 'LkcSelect',
          props: {
            url: '/organization/option/2347-after-review-list',
            optionConfig: { idStr: 'orgId', nameStr: 'orgName', prefix: '买方' },
            placeholder: '请选择买方',
          },
        },
      },
      {
        layout: noLabelLayout,
        field: 'supplierOrgId',
        width: 220,
        component: {
          name: 'LkcSelect',
          props: {
            url: '/organization/option/2347-after-review-list',
            optionConfig: { idStr: 'orgId', nameStr: 'orgName', prefix: '卖方' },
            placeholder: '请选择卖方',
          },
        },
      },
      {
        layout: noLabelLayout,
        field: 'keywords',
        width: 220,
        component: {
          name: 'Input',
          props: {
            placeholder: '物资名称/规格型号/通用名称',
          },
        },
      },
    ],
  }
  const tableParam = {
    loading: getLoading('getMainList'),
    columns,
    dataSource: materialMainList,
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'getMainList',
        payload: { current, pageSize },
      })
    }, pagination),
    rowKey: 'pscId',
    scroll: { x: 1150 },
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <SearchFormFilter {...searchParams} />
        <Table bordered {...tableParam} />
      </div>
    </div>
  )
}

IndexPage.propTypes = propTypes
export default connect(({ materialCompare, loading }) => ({ materialCompare, loading }))(IndexPage)

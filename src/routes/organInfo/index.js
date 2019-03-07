import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Icon, Spin, Row, Col, Modal } from 'antd'
import { includes } from 'lodash'
import PlainForm from '../../components/PlainForm'
import Bread from '../../components/Breadcrumb'
import Styles from './index.less'
import OrgManageTransModal from './orgManageTransfer' // 组织管理权
import EditModal from './editEnterpriseInfo' // 编辑企业资料
import PoolModal from './poolModal'
import ScopeModal from '../organization/orgDetail/modal/ScopeModal' // 经营范围
import EditCertificateModal from './editCompanyModal/ModalOrgInfo' // 编辑证件
import { getBasicFn, getUploadAuth, manageFlag } from '../../utils/index'
import { IMG_UPLOAD, UPYUN_BUCKET, IMG_ORIGINAL, IMG_SIZE_LIMIT } from '../../utils/config'

import { leftData, rightData } from './data'

const namespace = 'organInfo'
function OrganInfo({ organInfo, addressList, loading }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    parentOrgList,
    orgDetail,
    certificateList,
    searchData,
    orgPersonList,
    orgPersonVisible,
    orgPersonListPagination,
    orgEditVisible,
    addressOptions,
    searchValue,
    expandedKeys,
    autoExpandParent,
    category68Ids,
    categoryTree,
    scopeModalVisible,
    modalVisible,
    eternalLifeObj,
    poolModalVisible,
    certificates,
    reason,
    auditStatus,
    secondGradeList,
    parentGradeList,
  } = organInfo
  const { orgName, profit, certificateType, orgTypeCode, downloadKey, orgErp } = orgDetail
  // 企业证件
  const plainList = certificateList.map((obj) => {
    const props = {
      '证件类型|fill': obj.certificateTypeText,
      '证件|fill|img': obj.imageUrls,
      '证件号|fill': obj.certificateCode,
      '有效期|fill': obj.eternalLife
        ? `${obj.startDate}~长期有效`
        : `${obj.startDate || ''}~${obj.endDate || ''}`,
    }
    return (
      <div key={obj.certificateType} className={Styles['aek-plain-item']}>
        <PlainForm data={props} />
      </div>
    )
  })
  // 组织管理权限转让
  const ornManageTransProps = {
    searchData,
    orgPersonList,
    orgPersonVisible,
    dispatch: dispatchAction,
    loading: getLoading('getOrgPerson'),
    orgPersonListPagination,
  }
  // 编辑企业资料
  const editProps = {
    dispatch: dispatchAction,
    loading: getLoading('editOrgDetail'),
    orgDetail,
    orgEditVisible,
    addressOptions,
    addressList,
    secondGradeList,
    parentGradeList,
    parentOrgList,
    onSearchOrg(e) {
      dispatchAction({
        type: 'queryParentOrgList',
        payload: {
          orgName: e,
        },
      })
    }
  }
  // 维护经营范围
  const getParentKey = (value, tree) => {
    let parentId
    for (const items of tree) {
      const node = items
      if (node.children) {
        if (node.children.some(item => item.value === value)) {
          parentId = node.value
        } else if (getParentKey(value, node.children)) {
          parentId = getParentKey(value, node.children)
        }
      }
    }
    return parentId
  }
  // 经营范围设置
  const scopeParam = {
    scopeLoadingStatus: getLoading('setScope'),
    searchValue,
    expandedKeys,
    autoExpandParent,
    category68Ids,
    categoryTree,
    scopeModalVisible,
    onCancel() {
      dispatchAction({
        payload: {
          scopeModalVisible: false,
        },
      })
    },
    onChangePara(e) {
      if (!e.target.value.startsWith(' ')) {
        const value = e.target.value
        const gData = []
        if (e.target.value) {
          const loopArr = data =>
            data.map((item) => {
              if (item.children) {
                loopArr(item.children)
              }
              return gData.push({
                label: item.label,
                value: item.value,
                wordArr: [item.label, item.textHelp ? item.textHelp : ''],
              })
            })
          loopArr(categoryTree)
        }
        dispatchAction({
          payload: {
            searchValue: value,
          },
        })
        const expand = gData
          .map((item) => {
            const flag = item.wordArr.some(_ => _.indexOf(value) > -1)
            if (flag) {
              return getParentKey(item.value, categoryTree)
            }
            return null
          })
          .filter((item, i, self) => item && self.indexOf(String(item)) === i)
        dispatchAction({
          payload: {
            searchValue: value,
            expandedKeys: [...expand, ...category68Ids],
            autoExpandParent: true,
          },
        })
      }
    },
    onExpand(onExpandedKeys) {
      dispatchAction({
        payload: {
          autoExpandParent: false, // 自动展开
          expandedKeys: onExpandedKeys, // 默认展开的节点
        },
      })
    },
    onCheckTree(checkedKeys) {
      dispatchAction({
        payload: {
          category68Ids: checkedKeys,
          changeStatus: true,
        },
      })
    },
    onOkScope() {
      dispatchAction({ type: 'setScope' })
    },
  }
  // 总库Id设置
  const poolModalParam = {
    dispatch: dispatchAction,
    poolModalVisible,
    orgDetail,
  }
  // // 判断是企业还是医院
  // let orgType = ''
  // const typeId = {
  //   hospital: '02',
  //   supplier: '03',
  // }
  // if (orgTypeCode === '02') {
  //   orgType = typeId.hospital
  // } else if (orgTypeCode === '03') {
  //   orgType = typeId.supplier
  // }
  // 编辑企业证件
  const editCompanyModalProps = {
    dispatch: dispatchAction,
    certificates, //  扩展资料
    reason,
    auditStatus,
    loading: getLoading('setCertificateForFront'),
    organizationInfo: {
      modalVisible,
      orgType: orgTypeCode, // 医院供应商判断
      profit, //  营利 非营利
      eternalLifeObj, // 复选框状态
      certificateType, // 多证合一  传统三证
      radioChange(value) {
        dispatchAction({
          payload: {
            orgDetail: {
              ...orgDetail,
              certificateType: value,
            },
          },
        })
      },
    },
    orgName,
  }
  // 限制图片大小
  const handleBeforeUpload = (file) => {
    const isLtLimit = file.size / 1024 / 2014 < IMG_SIZE_LIMIT
    if (!isLtLimit) {
      Modal.error({
        content: `您只能上传小于${IMG_SIZE_LIMIT}MB的文件`,
        maskClosable: true,
      })
    }
    return isLtLimit
  }
  // 企业logo更换
  const LogoProps = {
    name: 'file',
    headers: {
      'X-Requested-With': null,
    },
    action: `${IMG_UPLOAD}`,
    accept: '.jpg,.png,.bmp,.pdf',
    beforeUpload: handleBeforeUpload,
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        dispatchAction({
          type: 'uploadImage',
          payload: {
            logoUrl: `${IMG_ORIGINAL}/${info.file.response.content}`,
          },
        })
      } else if (info.file.status === 'error') {
        Modal.error({
          content: '图片上传失败',
          maskClosable: true,
        })
      }
    },
  }
    const downloadBtn = orgTypeCode === '02' &&
    !downloadKey &&
    !!orgErp && (
      <a
        className={Styles.mr20}
        key="download"
        onClick={() => {
          dispatchAction({
            type: 'downloadFile',
          })
        }}
      >
        <Icon style={{ marginRight: 8 }} type="download" />下载激活文件
      </a>
    )
  const scopeBtn = manageFlag(orgTypeCode) ? (
    ''
  ) : (
    <a
      className={Styles.mr20}
      key="manageRange"
      onClick={() => {
        dispatchAction({ type: 'queryDefaultTree' })
      }}
    >
      <Icon style={{ marginRight: 8 }} type="save" />维护经营范围
    </a>
  )
  const poolId =  orgTypeCode === '02' ?  (
    (
      <a
        className={Styles.mr20}
        key="download"
        onClick={() => {
          dispatchAction({
            payload: {
              poolModalVisible: true,
            },
          })
        }}
      >
        <Icon style={{ marginRight: 8 }} type="edit" /> 总库ID配置
      </a>
    )
  ) : ('')
  return (
    <div className="aek-layout">
      <div className="bread">
        <div className="aek-fl">
          <Bread />
        </div>
        <div className="aek-fr">
          {poolId}
          {downloadBtn}
          {scopeBtn}
          <a
            className={Styles.mr20}
            key="manageTransfer"
            onClick={() => {
              dispatchAction({ type: 'getOrgPerson', payload: { current: 1, pageSize: 10 } })
            }}
          >
            <Icon style={{ marginRight: 8 }} type="close-circle-o" />组织管理权转让
          </a>
          <a
            className={Styles.mr20}
            key="editEnterprise"
            onClick={() => {
              dispatchAction({ payload: { orgEditVisible: true } })
              dispatchAction({
                type: 'firstLevel',
              })
              dispatchAction({
                type: 'secondLevel',
              })
              dispatchAction({
                type: 'queryParentOrgList',
                payload: {
                  orgName: '',
                },
              })
            }}
          >
            <Icon style={{ marginRight: 8 }} type="edit" />编辑企业资料
          </a>
        </div>
      </div>
      <div className="content" style={{ height: 'auto' }}>
        <div>
          <Spin spinning={getLoading('getOrgDetail')}>
            <div className="aek-content-title">机构信息</div>
            <Row>
              <Col span={12}>
                <PlainForm data={leftData({ LogoProps, data: orgDetail })} itemSpacing="10px" />
              </Col>
              <Col span={12}>
                <PlainForm data={rightData({ data: orgDetail })} />
              </Col>
            </Row>
          </Spin>
        </div>
        {!includes(['05', '06', '01'], orgTypeCode) && ( // 银行，监管机构， 平台不用编辑证件
          <div>
            <div className="aek-content-title">
              <span className="aek-title-left">企业证件</span>
              <a
                key="edit"
                onClick={() => {
                  dispatchAction({
                    type: 'getCertificatesList',
                  })
                }}
                className="aek-title-right"
              >
                <Icon style={{ marginRight: 8 }} type="edit" />编辑企业证件
              </a>
            </div>
            <div>{plainList}</div>
          </div>
        )}
      </div>
      <OrgManageTransModal {...ornManageTransProps} />
      <EditModal {...editProps} />
      <ScopeModal {...scopeParam} />
      <PoolModal {...poolModalParam} />
      <EditCertificateModal {...editCompanyModalProps} />
    </div>
  )
}

OrganInfo.propTypes = {
  organInfo: PropTypes.object,
  loading: PropTypes.object,
  addressList: PropTypes.array,
}

export default connect(({ organInfo, loading, app: { constants: { addressList } } }) => ({
  organInfo,
  loading,
  addressList,
}))(OrganInfo)

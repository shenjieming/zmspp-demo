import React from 'react'
import moment from 'moment'
import { Row, Col, Button } from 'antd'
import { trim, find } from 'lodash'
import { getOption, halfToFull } from '../../../../utils'
// import { MATERIALS_CERTIFICATE_TYPE } from '../../../../utils/constant'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}


const formData = ({
  step,
  status,
  registCodeOptions,
  agentOptionsSearch, // 注册证号搜索
  registCodeSelect,
  detail, // 获取证件的详情
  factoryOptions, // 生产企业
  checkedLongchange, // 长期有效事件
  handleBack, // 编辑证件  返回上一步
  checkedFactorySelect, // 生产企业选择
  checkedFactorychange, // 生产企业异步搜索
  firstFormData = {},
  agentOptions,
  registRadioChange, // 是否进口
  produceOptionsSearch, // 总代异步搜索
  produceOptionsSelect, // 总代下拉选择
  handleRelieve, // 解除换证
  radioButtonClick, // 证件类型点击事件
  handleReload, // 同步标准证件信息
  viewModal, // 注册证查看

  registTypeList = [],

  noCertificateClick,
}) => {
  const {
    certificateType = '1',
    certificateId,
    certificateNo,
    importedFlag,
    agentSupplierName,
    validDateLongFlag,
    productName,
    produceFactoryName,
    validDateStart,
    validDateEnd,
    certificateImageUrls,
    replacedCertificateId,
    replacedCertificateNo,
    platformAuthStatus,
    standardCertificateId, // 标准注册证Id
  } = detail

  const getView = () => {
    if (status === 1) {
      if (standardCertificateId) {
        return true
      }
      return false
    } else if (status === 2) {
      // 无证号证件 审核通过后依然可以编辑
      if (Number(certificateType) < 0) {
        return false
      }

      if (standardCertificateId || platformAuthStatus === 2) {
        return false
      }
      return false
    } else if (status === 3) {
      if (standardCertificateId || platformAuthStatus === 2) {
        return true
      }
      return false
    }
    return true
  }

  const other = registTypeList.filter(item =>
    Number(item.dicValue) < 0 && !item.dicValueStatus)


  return {
    1: [{
      label: '老证编号',
      layout: formItemLayout,
      exclude: !(firstFormData.oldCertificateId && status === 3),
      view: true,
      options: {
        initialValue: firstFormData.oldCertificateNo || undefined,
      },
      viewRender(value) {
        return (<a onClick={() => {
          viewModal(firstFormData.oldCertificateId)
        }}
        >{value}</a>)
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '证件类型',
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      field: 'certificateType',
      options: {
        initialValue: { label: '注册证', key: '1' },
        rules: [
          {
            required: true,
            message: '请选择证件类型',
          },
        ],
      },
      component: {
        name: 'LkcRadioButton',
        props: {
          options: registTypeList.filter(item =>
            Number(item.dicValue) > 0 && !item.dicValueStatus).map(item =>
            ({ label: item.dicValueText, value: item.dicValue })),
          handClick: radioButtonClick,
        },
      },
    },
    {
      label: '证件编号',
      layout: formItemLayout,
      field: 'certificateNo',
      options: {
        initialValue: certificateNo || undefined,
        rules: [
          {
            required: true,
            message: '请输入证号',
            whitespace: true,
          }, {
            max: 100,
            message: '最多输入100个字符',
          },
        ],
        normalize: value => halfToFull(value),
      },
      component: {
        name: 'Select',
        props: {
          mode: 'combobox',
          showSearch: true,
          placeholder: '请输入证号',
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: '',
          allowClear: true,
          onSearch(value) {
            let excludeCertificateId
            if (status === 3) {
              excludeCertificateId = certificateId
            }
            agentOptionsSearch(value, excludeCertificateId)
          },
          onSelect(value) {
            registCodeSelect(value)
          },
          children: getOption(registCodeOptions, {
            idStr: 'certificateNo',
            nameStr: 'certificateNo',
          }),
        },
      },
    }, <Row className="aek-mb20">
      {other.length && <Col offset={6}>如果资质没有证号请选择：</Col>}
    </Row>, <Row>
      <Col offset={6}>
        {registTypeList.filter(item =>
          Number(item.dicValue) < 0 && !item.dicValueStatus).map(item =>
          (<Button
            onClick={() => {
              noCertificateClick({ key: item.dicValue, label: item.dicValueText })
            }}
            key={item.dicValueId}
          >{item.dicValueText}</Button>))
        }
      </Col>
    </Row>,
    ],
    2: [
      (firstFormData.oldCertificateId && status === 3) && <div className="aek-form-head">老证信息</div>,
      {
        label: '证件编号',
        layout: formItemLayout,
        view: true,
        options: {
          initialValue: firstFormData.oldCertificateNo,
        },
        exclude: !(firstFormData.oldCertificateId && status === 3),
        viewRender(text) {
          return (<a
            onClick={() => {
              viewModal(firstFormData.oldCertificateId)
            }}
          >{text}</a>)
        },
        component: {
          name: 'Input',
        },
      },
      <div className="aek-form-head">
        <span style={{ float: 'left' }}>基础信息</span>
        {/*{ (platformAuthStatus === 2 && status !== 4) && <Button*/}
          {/*style={{ float: 'right' }}*/}
          {/*className="aek-mr30"*/}
          {/*icon="reload"*/}
          {/*size="small"*/}
          {/*disabled={!standardCertificateId}*/}
          {/*onClick={() => {*/}
            {/*let reqData = {}*/}
            {/*reqData = {*/}
              {/*standardCertificateId,*/}
              {/*certificateId,*/}
            {/*}*/}
            {/*// }*/}
            {/*handleReload(reqData)*/}
          {/*}}*/}
        {/*>同步标准证件信息</Button>}*/}
      </div>,
      {
        label: '证件编号',
        layout: formItemLayout,
        field: 'certificateNo',
        view: true,
        options: {
          initialValue: certificateNo || undefined,
        },
        viewRender() {
          return (
            <div>
              <span className="aek-mr20">{certificateNo || undefined}</span>
              {
                (status === 1 && Number(certificateType) > 0) ?
                  <a
                    className="aek-ml20"
                    onClick={handleBack}
                  >编辑证号</a>
                  : undefined
              }

            </div>
          )
        },
        component: {
          name: 'Input',
        },
      },
      {
        label: '证件类型',
        layout: formItemLayout,
        fiele: 'certificateType',
        view: true,
        component: {
          name: 'Input',
        },
        viewRender(value) {
          const obj = find(registTypeList, item => Number(item.dicValue) === Number(value))
          return obj && obj.dicValueText
        },
        options: {
          initialValue: certificateType ?
            `${certificateType}` :
            '1',
        },
      },
      {
        label: '产品名称',
        layout: formItemLayout,
        field: 'productName',
        view: getView(),
        options: {
          initialValue: productName || undefined,
          rules: [
            {
              required: true,
              message: '请输入产品名称',
            },
          ],
        },
        component: {
          name: 'Input',
          props: {
            placeholder: '请输入产品名称',
          },
        },
      },
      {
        label: '生产企业',
        layout: formItemLayout,
        field: 'produceFactoryName',
        view: getView(),
        options: {
          initialValue: produceFactoryName,
          rules: [
            {
              required: true,
              message: '请输入生产企业',
            },
          ],
          // normalize: value => trim(value),
        },
        component: {
          name: 'Select',
          props: {
            mode: 'combobox',
            showSearch: true,
            placeholder: '请输入生产企业',
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: '',
            allowClear: true,
            onSearch: checkedFactorychange,
            onSelect: checkedFactorySelect,
            children: getOption(factoryOptions, {
              idStr: 'produceFactoryName',
              nameStr: 'produceFactoryName',
            }),
          },
        },
      },
      {
        label: '有效期',
        layout: status === 4 ? formItemLayout :
          {
            labelCol: {
              span: 8,
            },
            wrapperCol: {
              span: 14,
            },
          },
        field: 'validDateStart',
        view: getView(),
        viewRender(value, record) {
          if (record.validDateLongFlag) {
            return `${detail.validDateStart}至长期有效`
          }
          return `${detail.validDateStart || ''}至${detail.validDateEnd || ''}`
        },
        col: status === 4 ? 24 : 18,
        options: {
          initialValue: validDateStart &&
          validDateEnd && [validDateStart, validDateEnd],
          rules: [
            {
              required: true,
              message: '必填项不能为空',
            },
            {
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
            },
          ],
        },
        exclude: standardCertificateId ? false : (validDateLongFlag),
        component: {
          name: 'TimeQuantum',
          props: {
            timeDifference: [5, 0, -1],
            isRequired: true,
            startProps: {
              placeholder: '选择开始时间',
            },
            endProps: {
              placeholder: '选择结束时间',
            },
          },
        },
      },
      {
        label: '有效期',
        layout: {
          labelCol: {
            span: 13,
          },
          wrapperCol: {
            span: 10,
          },
        },
        field: 'validDateEnd',
        col: !validDateLongFlag ? 4 : 11,
        exclude: !validDateLongFlag || status === 4 || standardCertificateId,
        options: {
          initialValue: validDateStart && moment(validDateStart, 'YYYY-MM-DD'),
          rules: [{ required: true, message: '必填项不能为空' }],
        },
        component: {
          name: 'DatePicker',
        },
      },
      {
        exclude:
        `${certificateType}` === '1' ||
        !validDateLongFlag || status === 4 || standardCertificateId,
        width: 'auto',
        view: true,
        options: {
          initialValue: <span style={{ lineHeight: '32px', paddingRight: '8px' }}>至</span>,
        },
      },
      {
        field: 'validDateLongFlag',
        col: 5,
        layout: {
          wrapperCol: {
            span: 20,
          },
        },
        options: {
          valuePropName: 'checked',
          initialValue: validDateLongFlag || false,
        },
        exclude:
        `${certificateType}` === '1' || status === 4 || standardCertificateId,
        component: {
          name: 'Checkbox',
          props: {
            children: '长期有效',
            onChange: checkedLongchange,
          },
        },
      },
      {
        label: '是否进口',
        layout: formItemLayout,
        field: 'importedFlag',
        options: {
          initialValue: importedFlag || false,
          rules: [{ required: true, message: '必填项不能为空' }],
        },
        view: getView(),
        component: {
          name: 'RadioGroup',
          props: {
            placeholder: '请选择',
            onChange(e) {
              registRadioChange(e)
            },
            options: [
              {
                label: '是',
                value: true,
              },
              {
                label: '否',
                value: false,
              },
            ],
          },
        },
      },
      {
        label: '总代',
        layout: formItemLayout,
        field: 'agentSupplierName',
        exclude: !importedFlag,
        view: getView(),
        options: {
          initialValue: agentSupplierName || undefined,
          rules: [
            {
              required: true,
              message: '请输入注册证生产企业',
            },
          ],
          normalize: value => trim(value),
        },
        component: {
          name: 'Select',
          props: {
            mode: 'combobox',
            showSearch: true,
            placeholder: '请输入总代名称',
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: '',
            allowClear: true,
            onSearch: produceOptionsSearch,
            onSelect: produceOptionsSelect,
            children: getOption(agentOptions, {
              idStr: 'agentSupplierName',
              nameStr: 'agentSupplierName',
            }),
          },
        },
      },
      <div className="aek-form-head">
      证件图片信息
        <div
          style={{
            color: '#bebebe',
            fontSize: '12px',
            fontWeight: 'initial',
            lineHeight: 2,
          }}
        >
          <Row span={24}>
            <Col style={{ textAlign: 'right', paddingRight: '10px' }} span={6}>
              注意:
            </Col>
            <Col style={{ overflow: 'hidden' }} span={18}>
              <p>1、图片必须盖公司红章</p>
              <p>2、图片上传时必须要把注册证首页、注册登记表、规格附页全部上传 </p>
              <p>3、图片大小限制20M以内，格式BMP、pdf、jpg、png</p>
            </Col>
          </Row>
        </div>
      </div>,
      {
        layout: {
          wrapperCol: {
            span: 14,
            offset: 6,
          },
        },
        view: status === 4,
        field: 'certificateImageUrls',
        options: {
          initialValue: certificateImageUrls || undefined,
          imgSrc: certificateImageUrls,
          rules: [{ required: true, message: '必填项不能为空' }],
        },
        component: {
          name: 'UploadButton',
          props: {
            placeholder: '请输入',
          },
        },
      },
      replacedCertificateNo && <div className="aek-form-head">新证信息</div>,
      {
        options: {
          initialValue: (
            <span>
              <a
                onClick={() => {
                  viewModal(replacedCertificateId)
                }}
              >
                {replacedCertificateNo}
              </a>
              <a
                className="aek-ml30"
                onClick={() => {
                  handleRelieve(certificateId)
                }}
              >
                解除换证
              </a>
            </span>
          ),
        },
        label: '新证号',
        layout: formItemLayout,
        field: 'replacedCertificateNo',
        view: true,
        exclude: !replacedCertificateNo,
      },
    ],
  }[step]
}

export default {
  formData,
}

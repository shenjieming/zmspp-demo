import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Tree, Popover, Icon } from 'antd'
import RightContet from './rightPersonList'
import AddDept from './addDept'
import AddPerson from './addPerson'
import Style from './index.less'
import Bread from '../../components/Breadcrumb'
import style from '../../components/SearchTree/SearchTree.less'

const TreeNode = Tree.TreeNode

const Authority = ({ personAdmin, dispatch, effects, orgType, routes }) => {
  const {
    deptTreeList,
    dataSource,
    searchData,
    pagination,
    deptId,
    deptName,
    deptDetail,
    editModalVisible,
    deptSelect,
    addModalVisible,
    addPersonModalVisible,
    registPerson,
    personRegistFlag,
  } = personAdmin
  const provp = (title, id) => {
    if (id && id === '-1') {
      return title
    }
    return (<Popover
      overlayClassName={style.popover}
      placement="right"
      overlayStyle={{ color: '#666' }}
      content={
        <a
          className={style.icon}
          onClick={() => {
            dispatch({
              type: 'personAdmin/getDeptDetail',
              payload: { deptId: id },
            })
          }}
        >
          <Icon
            type="edit"
          />
          编辑
        </a>
      }
      trigger="hover"
    >
      {title}
    </Popover>)
  }
  // 部门树数据处理函数
  const loop = data =>
    data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.deptId} title={provp(item.deptName, item.deptId)} value={item.deptName}>
            {loop(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.deptId} title={provp(item.deptName, item.deptId)} value={item.deptName} />
    })
  // 部门选择
  const treeSlect = (selectedKeys, { selected, selectedNodes }) => {
    if (selected) {
      dispatch({
        type: 'personAdmin/getPersonTableData',
        payload: {
          deptId: selectedKeys[0],
          deptName: selectedNodes[0].props.value,
          current: 1,
          pageSize: searchData.pageSize || 10,
          status: null,
          gender: null,
          keywords: null,
        },
      })
    }
  }
  const rightProps = {
    deptId,
    deptName,
    dataSource,
    dispatch,
    searchData,
    effects,
    pagination,
    deptDetail,
    editModalVisible,
    deptSelect,
    deptTreeList,
  }
  const addDeptProps = {
    addModalVisible,
    dispatch,
    effects,
    deptSelect,
    orgType,
  }
  const addPersonProps = {
    addPersonModalVisible,
    dispatch,
    effects,
    registPerson,
    personRegistFlag,
    deptTreeList,
    deptName,
    deptId,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Bread routes={routes} />
      </div>
      <div className="content">
        <div className="aek-layout-hor">
          <div className={Style.sider}>
            <div className="aek-text-center aek-ptb10" style={{ lineHeight: 0, borderBottom: '1px solid #bebebe' }}>
              <Button
                style={{ width: '60%' }}
                onClick={() => {
                  dispatch({ type: 'personAdmin/updateState', payload: { addModalVisible: true } })
                }}
                type="primary"
                icon="plus"
              >
            新增部门
              </Button>
            </div>
            <div style={{ padding: '0 10px' }}>
              <Tree
                selectedKeys={[deptId]}
                className="draggable-tree"
                defaultExpandedKeys={['-1']}
                onSelect={treeSlect}
                defaultExpandAll
                showLine
                defaultSelectedKeys={[deptId]}
              >
                {loop(deptTreeList)}
              </Tree>
            </div>
          </div>
          <div className={Style.main}>
            <RightContet {...rightProps} />
          </div>
        </div>
      </div>
      <AddDept {...addDeptProps} />
      <AddPerson {...addPersonProps} />
    </div>
  )
}

Authority.propTypes = {
  children: PropTypes.node,
  personAdmin: PropTypes.object,
  dispatch: PropTypes.func,
  effects: PropTypes.object,
  orgType: PropTypes.string,
  routes: PropTypes.array,
}

export default connect(
  ({ personAdmin, loading: { effects }, app: { organizationInfo: { orgType } } }) => ({
    personAdmin,
    effects,
    orgType,
  }),
)(Authority)

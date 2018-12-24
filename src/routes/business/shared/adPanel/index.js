import React from 'react'
import propTypes from 'prop-types'
import { panel } from '../index.less'
import styles from './index.less'

const PropTypes = {}
const Adpanel = () => (
  <div className={panel}>
    <a
      href="http://www.aek56.com/helpArticle?articleId=6EB6B0D5BCC94B0F8C62F1B74115C6F6&relateId=0B1D2678A1B84FDEBF53A2E4465DF50E"
      target="_blank"
    >
      <div className={styles.img} />
    </a>
  </div>
)

Adpanel.propTypes = PropTypes
export default Adpanel

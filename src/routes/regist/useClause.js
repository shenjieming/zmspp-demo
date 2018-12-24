import React from 'react'
import { Link } from 'dva/router'
import styles from './page.less'
import logo from '../../assets/logo-white.png'
import { footerText } from '../../utils/config'

function UseClause() {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <img className={styles.logo} src={logo} alt="医储" />
        <div className={styles.title}>
          <Link to="/login" className={styles.title}>登录</Link>
          <span className={`aek-mlr15 ${styles.title}`}>|</span>
          <Link to="/regist" className={styles.title}>注册</Link>
        </div>
      </div>
      <div className={styles.content} style={{ overflowY: 'scroll' }}>
        <div className={styles.notesContent}>
          <h1 className="aek-text-center">使用条款</h1>
          <p />
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 请您认真阅读并充分理解本协议中各条款，包括免除或者限制零库存责任的免责条款及对用户的权利限制条款，并选择接受或不接受本协议。如您完成了注册、登录、 使用等行为，则将视为对本协议的接受，并同意接受本协议各项条款的约束。本协议由零库存进行修订，修订后的协议条款经网站公布，即代替原协议条款，用户继续接受平台服务，即视为已接受了修改后的协议。
            <br />&nbsp;
          </p>
          <p>&nbsp;</p>
          <h3>服务条件</h3>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 用户要使用零库存提供的服务，须遵守以下约定：</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1、用户要对其发布的信息负责，应提供详尽、真实、准确的企业资料，不得发布不真实的、有歧义、违法国家法律法规等的信息，绝对禁止发布误导性的、恶意的消息，用 户不得利用本平台危害国家安全、泄露国家秘密，不得侵犯国家社会集体的和公民的合法权益，不得利用本平台制作和传播侵犯任何第三方权益的信息。 如有以上情形发生，零库存可将相关内容删除或暂停会员服务。
            <br />&nbsp;</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2、零库存向用户提供的帐号及密码只供会员使用,如果用户将帐号或密码丢失或被盗，应及时找回或重新登记并重新设置密码。因用户帐号及密码丢失而造成的损失， 用户应自行承担责任。
            <br />&nbsp;</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3、如用户利用提供的服务从事包括但不限于上述列举的违法或侵权行为，给零库存或任何第三方造成损失的，用户应负责全额赔偿。零库存保留其给零库存造成的名誉及财产损失，进行法律起诉的权利。</p>
          <p>&nbsp;</p>
          <h3>权利及义务</h3>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 本网站上关于零库存会员的产品（包括但不限于公司名称、联系人及联络信息，产品的描述和说明，相关图片等）的信息均由会员自行提供，会员依法应对其提供的 任何信息承担全部责任。零库存对此等信息的准确性、完整性、合法性或真实性均不承担任何责任。此外，零库存对任何使用或提供本网站信息的商业活动及 其风险不承担任何责任。
            <br />
            <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 会员可以下载本网站上显示的资料，但这些资料只限用于正当商业用途，不得用于任何侵权行为，无论是否在资料上明示，所有此等资料都是受到 版权法的法律保护。会员没有获得零库存或各自的版权所有者明确的书面同意下，不得分发、修改、散布、再使用、再传递或使用本网站的内容用于任何公众商业用途。
            <br />
            <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 对于因不可抗力或其它无法控制的原因造成的服务中断或其它缺陷，包括由于系统问题导致的有关数据或信息的丢失，零库存不应承担责任，但将尽可能地处理善后 事宜，并努力减少因此而给用户造成的损失和影响。
            <br />&nbsp;</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 零库存保留对用户提交的内容进行修改、不予发表、删除等权利。
            <br />&nbsp;</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 零库存保证不对外公开或向第三方提供用户注册资料及用户在使用网络服务时存储在零库存平台的非公开内容，但可根据如下规定对用户的信息进行披露:</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (a) 根据有关的法律法规要求；</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (b) 执行本服务条款；</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (c) 事先获得用户的明确授权；</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (d) 按照相关政府主管部门的要求；</p>
          <p>&nbsp;</p>
          <h3>免责声明</h3>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 零库存在此特别声明对如下事宜不承担任何法律责任：</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; （一） 零库存在此声明，对您使用网站、与本网站相关的任何内容、服务或其它链接至本网站的站点、内容均不作直接、间接、法定、约定的保证。
            <br />&nbsp;</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; （二） 无论在任何原因下（包括但不限于疏忽原因），对您或任何人通过使用本网站上的信息或由本网站链接的信息，或其他与本网站链接的网站信息所导致的损失或损 害 （包括直接、间接、特别或后果性的损失或损害，例如收入或利润之损失，电脑系统之损坏或数据丢失等后果），责任均由使用者自行承担(包括但不限于疏忽责任)。
            <br />
            <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 使用者对本网站的使用即表明同意承担浏览本网站的全部风险，对使用者在本网站存取资料所导致的任何直 接、相关的、后果性的、间接的或金钱上的损失不承担任何责任。</p>
          <p>
            <br />
          最近修订 2018年11月20日。</p>
          <p>上海零库存科技有限公司&nbsp;保留一切权利。</p>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerText}>
          {footerText.split('\n').map((text, i) => <div key={i}>{text}</div>)}
        </div>
      </div>
    </div>
  )
}
export default UseClause

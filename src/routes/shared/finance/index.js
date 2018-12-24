import React from 'react'

// 生成 卡片
const genHeadStatus = (...msg) => {
  if (!!msg && msg.length > 0) {
    return (
      <div style={{ height: 100 }}>
        {msg.map((item, idx) => {
          if (idx === 0) {
            return (
              <div key={idx} style={{ fontSize: 31, fontWeight: 'bold', marginBottom: 10 }}>
                {item}
              </div>
            )
          }
          return (
            <div key={idx} style={{ fontSize: 14, lineHeight: '30px' }}>
              {item}
            </div>
          )
        })}
      </div>
    )
  }
  return ''
}
export default { genHeadStatus }

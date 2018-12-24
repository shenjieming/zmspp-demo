import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import LkcLightBox from './aek-light-box'
import { IMG_WATERMARK } from '../../utils/config'

class AekLightIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props,
      imageArr: [],
      flag: false,
    }
  }

  componentDidMount() {
    const { photoIndex, url, currentData, dataSource } = this.props
    this.retImageList({ photoIndex, url, currentData, dataSource })
  }

  componentWillReceiveProps(nextProps) {
    const { photoIndex, url, currentData, dataSource } = nextProps
    this.setState({
      photoIndex,
    })
    this.retImageList({ photoIndex, url, currentData, dataSource })
  }

  retImageList({ photoIndex, url, dataSource, currentData }) {
    const imageArr = []
    let flag = true
    let current = {}
    if (url) {
      const newArr = url.split(',')
      for (const [key, value] of newArr.entries()) {
        const obj = {
          index: key,
          src: value,
        }
        imageArr.push(obj)
      }
      if (imageArr[photoIndex].src.toLowerCase().includes('.pdf')) {
        flag = false
      }
    } else if (dataSource && dataSource.length) {
      if (currentData && Object.keys(currentData).length) {
        current = currentData
        if (currentData.value.toLowerCase().includes('.pdf')) {
          flag = false
        } else {
          flag = true
        }
      } else if (dataSource[0].imgs && dataSource[0].imgs.length) {
        if (dataSource[0].imgs[0].value) {
          const data = dataSource[0].imgs[0].value.split(',')
          if (data && data.length) {
            current = {
              key: dataSource[0].key,
              value: data[0],
            }
            if (data[0].toLowerCase().includes('.pdf')) {
              flag = false
            } else {
              flag = true
            }
          }
        }
      } else {
        current = {
          key: dataSource[0].key,
        }
      }
    }
    this.setState({
      imageArr,
      flag,
      currentData: current,
    })
  }
  render() {
    const {
      isOpen = false,
      onCancel,
      imageDetail,
      imageDetailWidth,
      imageHeadDetail,
      onChange,
      dataSource,
    } = this.props
    const { imageArr, flag, photoIndex, currentData } = this.state
    const getMainUrl = () => {
      if (dataSource && dataSource.length) {
        let imageUrl = ''
        if (currentData && Object.keys(currentData).length) {
          const { value, key: id } = currentData
          dataSource.forEach((item) => {
            const { key, imgs } = item
            if (key === id) {
              imgs.forEach((i) => {
                const { value: urls } = i
                if (urls && urls.includes(value)) {
                  if (value.toLowerCase().includes('.pdf')) {
                    imageUrl = value
                  } else {
                    imageUrl = `${value}${IMG_WATERMARK}`
                  }
                }
              })
            }
          })
        } else if (dataSource[0].imgs && dataSource[0].imgs.length) {
          if (dataSource[0].imgs[0].value) {
            const data = dataSource[0].imgs[0].value.split(',')
            if (data && data.length) {
              const url = dataSource[0].imgs[0].value.split(',')[0]
              if (url.toLowerCase().includes('.pdf')) {
                imageUrl = url
              }
              imageUrl = `${url}${IMG_WATERMARK}`
            }
          }
        }
        return imageUrl
      } else if (imageArr.length && imageArr) {
        return imageArr[photoIndex].src + (!flag ? '' : IMG_WATERMARK)
      }
      return ''
    }
    return (<div>
      {isOpen ? (<LkcLightBox
        mainSrc={getMainUrl()}
        // nextSrc={(imageArr.length && imageArr ? imageArr[(photoIndex + 1) % imageArr.length].src : '') + (!flag ? '' : IMG_WATERMARK)}
        // prevSrc={(imageArr.length && imageArr ? imageArr[(photoIndex + imageArr.length - 1) % imageArr.length].src : '') + (!flag ? '' : IMG_WATERMARK)}
        imageArr={imageArr}
        onCloseRequest={() => {
          this.setState({
            isOpen: false,
            photoIndex: 0,
            currentData: {},
            imageArr: [],
          })
          onCancel()
        }}
        onMovePrevRequest={() => this.setState({
          photoIndex: (photoIndex + imageArr.length - 1) % imageArr.length,
        })}
        onMoveNextRequest={() => this.setState({
          photoIndex: (photoIndex + 1) % imageArr.length,
        })}
        onImageClick={(index, data) => {
          const state = {
            photoIndex: index,
          }
          if (!isEmpty(data)) {
            state.currentData = data
            state.flag = !data.value.toLowerCase().includes('.pdf')
          }
          this.setState({
            ...state,
          })
          if (onChange) {
            onChange(index)
          }
        }}
        enableZoom={flag}
        imageDetail={imageDetail}
        imageDetailWidth={imageDetailWidth}
        imageHeadDetail={imageHeadDetail}
        current={photoIndex ? Math.ceil((photoIndex + 1) / 5) : 1}
        photoIndex={photoIndex}
        dataSource={dataSource}
        currentData={currentData}
      />) : ''}
    </div>)
  }
}
AekLightIndex.propTypes = {
  photoIndex: PropTypes.number,
  url: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  imageDetail: PropTypes.node,
  imageDetailWidth: PropTypes.number,
  imageHeadDetail: PropTypes.node,
  onChange: PropTypes.func,
  dataSource: PropTypes.array,
  currentData: PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  }),
}
export default AekLightIndex

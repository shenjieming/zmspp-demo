import React from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import Editor from 'aek-react-editor'
import {
  IMG_UPLOAD,
  UPYUN_BUCKET,
  IMG_ORIGINAL,
} from '../../utils/config'
import { getUploadAuth } from '../../utils'

class Test extends React.Component {
  constructor(props) {
    super(props)
    const value = this.props.value || this.props.defaultValue
    this.state = {
      content: {
        editor: value || '<p></p>',
      },
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value || nextProps.defaultValue
		  this.state = {
		  	content: {
          editor: value || '<p></p>',
        },
      }
    }
  }

  getIcons = () => {
    const icons = [
      'source | undo redo | bold italic underline strikethrough fontborder emphasis | ',
      'paragraph fontfamily fontsize | superscript subscript | ',
      'forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ',
      'cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ',
      'horizontal date time  | image spechars | inserttable',
    ]
    return icons
  }
  getPlugins = () => ({
    image: {
      uploader: {
        name: 'file',
        url: `${IMG_UPLOAD}/${UPYUN_BUCKET}`,
      },
    },
  })

   // 图片上传请求参数
   requestFormData = (file) => {
     const formData = new FormData()
     const { policy, signature } = getUploadAuth()
     formData.append('policy', policy)
     formData.append('signature', signature)
     formData.append('file', file)
     return formData
   }

   handleChange(value) {
     const { onChange } = this.props
     const { content } = this.state
     if (onChange) {
       onChange(value)
     }
     this.setState({
       content: {
         ...content,
         editor: value,
       },
     })
   }

   render() {
     const icons = this.getIcons()
     const plugins = this.getPlugins()
     return (<Editor
       icons={icons}
       value={this.state.content.editor}
       onChange={this.handleChange}
       plugins={plugins}
       uploadImageCallback={(file) => {
         const requesData = this.requestFormData(file)
         return fetch(`${IMG_UPLOAD}/${UPYUN_BUCKET}`, {
           method: 'POST',
           body: requesData,
         }).then(response => response.json())
           .then((data) => {
             const { url } = data
             return {
               status: 'success',
               data: {
                 image_src: `${IMG_ORIGINAL}/${url}`,
               },
             }
           }).catch((error) => {
             message.error('图片上传失败')
             return error
           })
       }}
     />
     )
   }
}
Test.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
}

export default Test

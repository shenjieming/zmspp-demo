// 获取全部的发票信息
// const getInvoiceForm = ({
//   index,
//   FormItem,
// }) => (
//   <FormItem label="发票号码">
//     {getFieldDecorator(`invoiceNo-${i}`)(
//       <Input placeholder="请输入发票号码" />,
//     )}
//   </FormItem>
//   <FormItem label="发票金额">
//     {getFieldDecorator(`invoiceNo-${i}`)(
//       <Input placeholder="请输入发票号码" />,
//     )}
//   </FormItem>
//   <FormItem label="金额大写">
//     {getFieldDecorator(`invoiceNo-${i}`)(
//       <Input placeholder="请输入发票号码" />,
//     )}
//   </FormItem>
//   <FormItem label="发票日期">
//     {getFieldDecorator(`invoiceNo-${i}`)(
//       <Input placeholder="请输入发票号码" />,
//     )}
//   </FormItem>
//   <FormItem label="发票图片">
//     {getFieldDecorator(`invoiceNo-${i}`)(
//       <Input placeholder="请输入发票号码" />,
//     )}
//   </FormItem>
// )
const photoType = [
  '中标通知书',
  '销售合同',
  '采购合同',
  '配送资质',
  '上游发票',
]

export default {
  photoType,
}

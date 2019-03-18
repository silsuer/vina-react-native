

// 定义消息和动作常量，根据注入的消息调用不同的方法
export const actions = {
    uploadImage: 'upload-image',  // 上传图片
    heading1: 'heading1', // 标题1~6
    heading2: 'heading2',
    heading3: 'heading3',
    heading4: 'heading4',
    heading5: 'heading5',
    heading6: 'heading6',
    insertNote: 'insert-note', // 插入其他笔记
    hr:'hr',  // 横向分割线
    bold:'bold',  // 加粗
    italic:'italic',  // 斜体
    underline:'underline',  // 下划线
    strikethrough:'strikethrough',  // 删除线
    insertLink:'insert-link',  // 插入链接
    orderedList:'ordered-list',  // 有序列表
    unorderedList:'unordered-list', // 无序列表
    quote:'quote',  // 引用,
    checkbox:'checkbox', // 多选
    codeLine:'code-line',  // 单行内联代码
    codeArea:'code-area',  // 代码块    
    uploadFile:'upload-file',  // 上传附件
    insertRemindTask:'insert-remind-task',  // 插入提醒事项
    undo:'undo',  // 撤销
    redo:'redo',  // 重做
}
export const actions = {
  enableOnChange: 'ENABLE_ON_CHANGE',
  setTitleHtml: 'SET_TITLE_HTML',
  setContentHtml: 'SET_CONTENT_HTML',
  getTitleHtml: 'GET_TITLE_HTML',
  getTitleText: 'GET_TITLE_TEXT',
  toggleTitle: 'TOGGLE_TITLE',
  hideTitle: 'HIDE_TITLE',
  showTitle: 'SHOW_TITLE',
  getContentHtml: 'GET_CONTENT_HTML',
  getSelectedText: 'GET_SELECTED_TEXT',
  blurTitleEditor: 'BLUR_TITLE_EDITOR',
  blurContentEditor: 'BLUR_CONTENT_EDITOR',
  focusTitle: 'FOCUS_TITLE',
  focusContent: 'FOCUS_CONTENT',

  setBold: 'bold',
  setItalic: 'italic',
  setUnderline: 'underline',
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  heading4: 'h4',
  heading5: 'h5',
  heading6: 'h6',
  setParagraph: 'SET_PARAGRAPH',
  removeFormat: 'REMOVE_FORMAT',
  alignLeft: 'justifyLeft',
  alignCenter: 'justifyCenter',
  alignRight: 'justifyRight',
  alignFull: 'justifyFull',
  insertBulletsList: 'unorderedList',
  insertOrderedList: 'orderedList',
  insertLink: 'INST_LINK',
  updateLink: 'UPDATE_LINK',
  insertImage: 'INST_IMAGE',
  setSubscript: 'subscript',
  setSuperscript: 'superscript',
  setStrikethrough: 'strikeThrough',
  setHR: 'horizontalRule',
  setIndent: 'indent',
  setOutdent: 'outdent',
  setTitlePlaceholder: 'SET_TITLE_PLACEHOLDER',
  setContentPlaceholder: 'SET_CONTENT_PLACEHOLDER',
  setTitleFocusHandler: 'SET_TITLE_FOCUS_HANDLER',
  setContentFocusHandler: 'SET_CONTENT_FOCUS_HANDLER',
  prepareInsert: 'PREPARE_INSERT',
  restoreSelection: 'RESTORE_SELECTION',
  setCustomCSS: 'SET_CUSTOM_CSS',
  setTextColor: 'SET_TEXT_COLOR',
  setBackgroundColor: 'SET_BACKGROUND_COLOR',
  init: 'ZSSS_INIT',
  setEditorHeight: 'SET_EDITOR_HEIGHT',
  setFooterHeight: 'SET_FOOTER_HEIGHT',
  setPlatform: 'SET_PLATFORM',


  insertTask: 'INSERT_TASK',  // 插入任务(提醒/日程)
  insertAccount: 'INSERT_ACCOUNT', // 插入账单
  insertAnniversary: 'INSERT_ANNIVERSARY',  // 插入纪念日
  insertCountdown: 'INSERT_COUNTDOWN',  // 插入倒计时

  setFontSize: 'SET_FONT_SIZE',  // 设置字体大小

  frontInsert: 'FRONT_INSERT',  // 插入action
  frontAlign: 'FRONT_ALIGN',  // 对齐
  frontHeading: 'FRONT_HEADING',  // 标题
  frontStyle: 'FRONT_STYLE', // 样式
  frontColor: 'FRONT_COLOR',  // 颜色
};


export const messages = {
  TITLE_HTML_RESPONSE: 'TITLE_HTML_RESPONSE',
  TITLE_TEXT_RESPONSE: 'TITLE_TEXT_RESPONSE',
  CONTENT_HTML_RESPONSE: 'CONTENT_HTML_RESPONSE',
  ZSS_INITIALIZED: 'ZSS_INITIALIZED',
  SCROLL: 'SCROLL',
  LOG: 'LOG',
  TITLE_FOCUSED: 'TITLE_FOCUSED',
  CONTENT_FOCUSED: 'CONTENT_FOCUSED',
  SELECTION_CHANGE: 'SELECTION_CHANGE',
  CONTENT_CHANGE: 'CONTENT_CHANGE',
  SELECTED_TEXT_RESPONSE: 'SELECTED_TEXT_RESPONSE',
  LINK_TOUCHED: 'LINK_TOUCHED',
  SELECTED_TEXT_CHANGED: 'SELECTED_TEXT_CHANGED'
};

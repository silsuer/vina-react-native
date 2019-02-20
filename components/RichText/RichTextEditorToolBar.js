import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, View, TouchableOpacity, StyleSheet, Text, LayoutAnimation } from 'react-native';
import { actions } from './const';
import { SetFontSizeSvg, FrontColorSvg, SetTextColorSvg, SetBackgroundColorSvg, InsertImageSvg, SetBoldSvg, SetItalicSvg, AlignLeftSvg, InsertBulletsListSvg, InsertLinkSvg, InsertOrderedListSvg, InsertSvg, SetHRSvg, SetIndentSvg, SetOutdentSvg, SetParagraphSvg, SetStrikethroughSvg, SetSubscriptSvg, SetSuperscriptSvg, SetUnderlineSvg, H1Svg, H2Svg, H3Svg, H4Svg, H5Svg, H6Svg, RemoveFormatSvg, AlignCenterSvg, AlignFullSvg, AlignRightSvg, ToolBarSvg, AlignSvg, SetHeadingSvg, SetStyleSvg } from '../assets/svgs/RichTextEditor'
import { TaskIcon } from '../assets/svgs/NotesSvg'
import { AccountRecordSvg, AnniversarySvg, CountdownSvg } from '../assets/svgs/Common'
const defaultActions = [
  actions.insertImage, // 插入图片
  actions.setBold,     // 加粗
  actions.setItalic,    // 斜体
  actions.insertBulletsList,  // 无序列表
  actions.insertOrderedList, // 有序列表
  actions.insertLink,   // 插入链接
  actions.setUnderline,  // 下划线
  actions.heading1, // 标题 1
  actions.heading2,
  actions.heading3,
  actions.heading4,
  actions.heading5,
  actions.heading6,
  actions.setParagraph,  // 设置段落
  actions.removeFormat,  // 移除样式
  actions.alignLeft,     // 左对齐
  actions.alignCenter,   // 居中对齐
  actions.alignRight,   // 右对齐
  actions.alignFull,    // 全文对齐
  actions.setSubscript,  // 设置子脚本？
  actions.setSuperscript,  // 设置父脚本
  actions.setStrikethrough,  // 删除线
  actions.setHR,   // 横线分割，
  actions.setIndent,  // 缩进
  actions.setOutdent,  // 减少缩进
  actions.frontAlign,  // 出现对齐工具栏
  actions.frontHeading,  // 出现标题工具栏
  actions.frontInsert,  // 出现插入工具栏
  actions.frontStyle,   // 出现样式工具栏
];

const defaultActionsLevels = {
  // 第一层，插入、对齐、标题、样式
  [actions.frontInsert]: {
    label: '插入',
    tools: {
      [actions.insertImage]: {
        label: '图片',
        tools: null,
      },
      [actions.insertLink]: {
        label: '链接',
        tools: null,
      },
      [actions.setHR]: {
        label: '分割线',
        tools: null,
      },
      [actions.insertTask]: {
        label: '提醒',
        tools: null,
      },
      [actions.insertAccount]: {
        label: '账单',
        tools: null,
      },
      [actions.insertAnniversary]: {
        label: '纪念日',
        tools: null,
      },
      [actions.insertCountdown]: {
        label: '倒计时',
        tools: null
      }
    }
  },
  [actions.frontAlign]: {
    label: '对齐',
    tools: {
      [actions.alignLeft]: {
        label: '左对齐',
        tools: null,
      },
      [actions.alignCenter]: {
        label: '居中对齐',
        tools: null
      },
      [actions.alignRight]: {
        label: '右对齐',
        tools: null,
      },
      [actions.alignFull]: {
        label: '两端对齐',
        tools: null
      }
    }
  },
  [actions.frontHeading]: {
    label: '标题',
    tools: {
      [actions.heading1]: {
        label: 'H1',
        tools: null,
      },
      [actions.heading2]: {
        label: 'H2',
        tools: null,
      },
      [actions.heading3]: {
        label: 'H3',
        tools: null,
      },
      [actions.heading4]: {
        label: 'H4',
        tools: null
      },
      [actions.heading5]: {
        label: 'H5',
        tools: null
      },
      [actions.heading6]: {
        label: 'H6',
        tools: null,
      }
    }
  },
  [actions.frontStyle]: {
    label: '样式',
    tools: {
      [actions.setBold]: {
        label: '粗体',
        tools: null
      },
      [actions.setItalic]: {
        label: '斜体',
        tools: null,
      },
      [actions.setUnderline]: {
        label: '下划线',
        tools: null,
      },
      [actions.setStrikethrough]: {
        label: '删除线',
        tools: null,
      },
      [actions.setFontSize]: {
        label: '字号',
        tools: null,
      },
      [actions.frontColor]: {
        label: '颜色',
        tools: {
          [actions.setTextColor]: {
            label: '文本颜色',
            tools: null,
          },
          [actions.setBackgroundColor]: {
            label: '背景颜色',
            tools: null,
          }
        }
      }
    },
  },
  [actions.insertBulletsList]: {
    label: '无序列表',
    tools: null
  },
  [actions.insertOrderedList]: {
    label: '有序列表',
    tools: null,
  },


}

function getDefaultIcon() {
  const texts = {};
  texts[actions.insertImage] = <InsertImageSvg width='20' height='20' />   // 插入图片
  texts[actions.setBold] = <SetBoldSvg width='20' height='20' />     // 加粗
  texts[actions.setItalic] = <SetItalicSvg width='20' height='20' />     // 斜体
  texts[actions.insertBulletsList] = <InsertBulletsListSvg width='20' height='20' />   // 无序列表
  texts[actions.insertOrderedList] = <InsertOrderedListSvg width='20' height='20' />  // 有序列表
  texts[actions.insertLink] = <InsertLinkSvg width='20' height='20' />    // 插入链接
  texts[actions.setUnderline] = <SetUnderlineSvg width='20' height='20' />   // 下划线
  texts[actions.heading1] = <H1Svg width='20' height='20' />  // 标题 1
  texts[actions.heading2] = <H2Svg width='20' height='20' />
  texts[actions.heading3] = <H3Svg width='20' height='20' />
  texts[actions.heading4] = <H4Svg width='20' height='20' />
  texts[actions.heading5] = <H5Svg width='20' height='20' />
  texts[actions.heading6] = <H6Svg width='20' height='20' />
  texts[actions.setParagraph] = <SetParagraphSvg width='20' height='20' />   // 设置段落
  texts[actions.removeFormat] = <RemoveFormatSvg width='20' height='20' />   // 移除样式
  texts[actions.alignLeft] = <AlignLeftSvg width='20' height='20' />      // 左对齐
  texts[actions.alignCenter] = <AlignCenterSvg width='20' height='20' />    // 居中对齐
  texts[actions.alignRight] = <AlignRightSvg width='20' height='20' />    // 右对齐
  texts[actions.alignFull] = <AlignFullSvg width='20' height='20' />     // 两端对齐
  texts[actions.setSubscript] = <SetSubscriptSvg width='20' height='20' />   // 设置下角标
  texts[actions.setSuperscript] = <SetSuperscriptSvg width='20' height='20' />   // 设置上角标
  texts[actions.setStrikethrough] = <SetStrikethroughSvg width='20' height='20' />   // 删除线
  texts[actions.setHR] = <SetHRSvg width='20' height='20' />    // 横线分割，
  texts[actions.setIndent] = <SetIndentSvg width='20' height='20' />   // 缩进
  texts[actions.setOutdent] = <SetOutdentSvg width='20' height='20' />   // 减少缩进

  texts[actions.insertTask] = <TaskIcon width='20' height='20' />  // 插入提醒
  texts[actions.insertAccount] = <AccountRecordSvg width='20' height='20' />  // 插入账单
  texts[actions.insertAnniversary] = <AnniversarySvg width='20' height='20' /> // 插入纪念日
  texts[actions.insertCountdown] = <CountdownSvg width='20' height='20' />  // 插入倒计时
  texts[actions.setFontSize] = <SetFontSizeSvg width='20' height='20' />  // 设置字号
  texts[actions.frontColor] = <FrontColorSvg width='20' height='20' /> // 设置颜色(打开第三栏)
  texts[actions.setTextColor] = <SetTextColorSvg width='20' height='20' />  // 设置文本颜色
  texts[actions.setBackgroundColor] = <SetBackgroundColorSvg width='20' height='20' />  // 设置背景颜色

  // 插入
  texts[actions.frontInsert] = <InsertSvg width='20' height='20' />
  // 对齐
  texts[actions.frontAlign] = <AlignSvg width='20' height='20' />
  // 标题
  texts[actions.frontHeading] = <SetHeadingSvg width='20' height='20' />
  // 样式
  texts[actions.frontStyle] = <SetStyleSvg width='20' height='20' />
  return texts;
}


export default class RichTextToolbar extends Component {

  static propTypes = {
    getEditor: PropTypes.func.isRequired,
    actions: PropTypes.array,
    onPressAddLink: PropTypes.func,
    onPressAddImage: PropTypes.func,
    selectedButtonStyle: PropTypes.object,
    iconTint: PropTypes.any,
    selectedIconTint: PropTypes.any,
    unselectedButtonStyle: PropTypes.object,
    renderAction: PropTypes.func,
    iconMap: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const actions = this.props.actions ? this.props.actions : defaultActions;
    this.state = {
      editor: undefined,
      selectedItems: [],
      actions,
      // ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(this.getRows(actions, [])),

      firstLevel: null,  // 第一层级
      secondLevel: null,  // 第二层级
      thirdLevel: null,  // 第三层级

      // mode: this.props.mode ? this.props.mode : "sub",  // 如果是sub，则子bar在主bar下方出现，如果是sup，则子bar在主bar下方出现


    };
  }

  // componentDidReceiveProps(newProps) {
  //   const actions = newProps.actions ? newProps.actions : defaultActions;
  //   this.setState({
  //     actions,
  //     ds: this.state.ds.cloneWithRows(this.getRows(actions, this.state.selectedItems))
  //   });
  // }

  componentWillReceiveProps(newProps) {
    const actions = newProps.actions ? newProps.actions : defaultActions;
    this.setState({
      actions,
      // ds: this.state.ds.cloneWithRows(this.getRows(actions, this.state.selectedItems))
    });
  }



  getRows(actions, selectedItems) {
    return actions.map((action) => { return { action, selected: selectedItems.includes(action) }; });
  }

  componentDidMount() {
    const editor = this.props.getEditor();
    if (!editor) {
      throw new Error('Toolbar has no editor!');
    } else {
      editor.registerToolbar((selectedItems) => this.setSelectedItems(selectedItems));
      this.setState({ editor });
    }
  }

  setSelectedItems(selectedItems) {
    if (selectedItems !== this.state.selectedItems) {
      this.setState({
        selectedItems,
        // ds: this.state.ds.cloneWithRows(this.getRows(this.state.actions, selectedItems))
      });
    }
  }

  _getButtonSelectedStyle() {
    return this.props.selectedButtonStyle ? this.props.selectedButtonStyle : styles.defaultSelectedButton;
  }

  _getButtonUnselectedStyle() {
    return this.props.unselectedButtonStyle ? this.props.unselectedButtonStyle : styles.defaultUnselectedButton;
  }

  _getButtonIcon(action) {
    if (this.props.iconMap && this.props.iconMap[action]) {
      return this.props.iconMap[action];
    } else if (getDefaultIcon()[action]) {
      return getDefaultIcon()[action];
    } else {
      return undefined;
    }
  }

  _defaultRenderAction(action, selected) {
    const icon = this._getButtonIcon(action);
    //{/* {icon ? <Image source={icon} style={{ tintColor: selected ? this.props.selectedIconTint : this.props.iconTint }} /> : null} */}
    //{icon ? <NewNoteSvg width="20" height="20" style={{ tintColor: selected ? this.props.selectedIconTint : this.props.iconTint }} /> : null}
    return (
      <TouchableOpacity
        key={action}
        style={[
          { height: 50, width: 50, justifyContent: 'center' },
          selected ? this._getButtonSelectedStyle() : this._getButtonUnselectedStyle()
        ]}
        onPress={() => this._onPress(action)}
      >
        {icon ? icon : null}
      </TouchableOpacity>
    );
  }

  _renderAction(action, selected) {
    return this.props.renderAction ?
      this.props.renderAction(action, selected) :
      this._defaultRenderAction(action, selected);
  }

  // 渲染第一层级的代码
  generateFirstLevelRender() {
    // 遍历级别对象，取出键，根据键取出label和icon，组装成view
    return this.levelRender(defaultActionsLevels)
  }


  getMode() {
    return this.props.mode ? this.props.mode : "sub"
  }

  // 第二层，mode是sub，则渲染在下方view，mode是sup，则渲染在上方view
  generateSecondLevelRender(mode) {
    if (mode !== this.getMode()) return null
    LayoutAnimation.spring()
    // 根据当前第二层上的 actions 取出所有bar
    for (let n in defaultActionsLevels) {
      if (n === this.state.secondLevel) {
        // 遍历这层上的所有数据
        return this.levelRender(defaultActionsLevels[n].tools)
      }
    }
  }

  generateThirdLevelRender(mode) {
    if (mode !== this.getMode()) return null
    LayoutAnimation.spring()
    for (let n in defaultActionsLevels) {
      for (let nn in defaultActionsLevels[n].tools) {
        if (nn === this.state.thirdLevel) {
          console.log(111)
          console.log(defaultActionsLevels[n].tools[nn].tools)
          return this.levelRender(defaultActionsLevels[n].tools[nn].tools)
        }
      }
    }
  }

  levelRender(actionsLevels) {
    let first = []
    for (let n in actionsLevels) {
      let data = actionsLevels[n]
      data['name'] = n
      first.push(data)
    }

    return first.map((obj, index) => {
      // this._getButtonIcon(obj['name'])
      let icon = getDefaultIcon()[obj['name']]
      return (
        <TouchableOpacity
          onPress={() => this._onPress(obj['name'])}
          key={index}
          style={{
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: index === 0 ? 10 : 0,
          }
          }>
          <View opacity={this.includeItem(obj['name']) ? 1 : 0.7} style={{ justifyContent: 'center', alignItems: 'center' }}>
            {icon ? icon : null}
            < Text style={{ color: 'white', fontSize: 10, marginTop: 2 }}> {obj.label}</Text >
          </View>
        </TouchableOpacity >
      )
    })

  }

  // 传入插入、对齐、标题、样式中的一种，将传入的位置高亮
  highLightItem(action) {

    items = this.state.selectedItems
    // 如果是color，只高亮它一个
    if (action === actions.frontColor) {
      if (!this.includeItem(action)) {
        items.push(action)
        this.setState({ selectedItems: items })
      }
      return
    }

    // 先取消全部四个

    if (items.indexOf(actions.frontInsert) >= 0) {
      items.splice(items.indexOf(actions.frontInsert), 1)
    }
    if (items.indexOf(actions.frontAlign) >= 0) {
      items.splice(items.indexOf(actions.frontAlign), 1)
    }

    if (items.indexOf(actions.frontHeading) >= 0) {
      items.splice(items.indexOf(actions.frontHeading), 1)
    }
    if (items.indexOf(actions.frontStyle) >= 0) {
      items.splice(items.indexOf(actions.frontInsert), 1)
    }


    switch (action) {
      case actions.frontInsert:
      case actions.frontAlign:
      case actions.frontHeading:
      case actions.frontStyle:
        items.push(action)
        break;
    }

    this.setState({ selectedItems: items })
  }

  // 取消传入的action高亮
  cancelHighLightItem(action) {

    if (action === undefined) {
      // 先取消全部四个
      items = this.state.selectedItems
      if (items.indexOf(actions.frontInsert) >= 0) {
        items.splice(items.indexOf(actions.frontInsert), 1)
      }
      if (items.indexOf(actions.frontAlign) >= 0) {
        items.splice(items.indexOf(actions.frontAlign), 1)
      }

      if (items.indexOf(actions.frontHeading) >= 0) {
        items.splice(items.indexOf(actions.frontHeading), 1)
      }
      if (items.indexOf(actions.frontStyle) >= 0) {
        items.splice(items.indexOf(actions.frontInsert), 1)
      }
      this.setState({ selectedItems: items })
      return
    }

    items = this.state.selectedItems

    if (this.includeItem(action)) {
      console.log(items)
      console.log(action)
      items.slice(items.indexOf(action), 1)
      console.log("删除后：", items)
    }
    this.setState({ selectedItems: items })
  }

  // 判断selectItems中是否存在指定的action
  includeItem(action) {
    let flag = false // 默认不存在
    for (let i = 0; i < this.state.selectedItems.length; i++) {
      if (action === this.state.selectedItems[i]) {
        flag = true
      }
    }
    return flag
  }


  render() {

    // <ListView
    //   horizontal
    //   contentContainerStyle={{ flexDirection: 'row' }}
    //   dataSource={this.state.ds}
    //   renderRow={(row) => this._renderAction(row.action, row.selected)}
    // />

    let styles = StyleSheet.create({
      bar: {
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: this.props.backgroundColor ? this.props.backgroundColor + "99" : "blue",
        padding: 5,
        marginTop: 3,
        borderRadius: 25,
      },
    })

    return (
      <View
        // style={[{ height: 50, backgroundColor: 'orange', alignItems: 'center' }, this.props.style]}
        style={{
          flexDirection: 'row'
        }}
      >

        {/* 工具栏主体 */}
        <View style={[{
          display: this.props.open ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',

        }, this.props.style]}
        >
          {/* 上方第三层 */}
          <View style={[
            { display: this.getMode() === "sup" && this.state.thirdLevel ? 'flex' : 'none' },
            styles.bar
          ]}>
            {this.generateThirdLevelRender("sup")}
          </View>
          {/* 上方第二层 */}
          <View style={[{
            display: this.getMode() === "sup" && this.state.secondLevel ? 'flex' : 'none'
          }, styles.bar]}>
            {this.generateSecondLevelRender("sup")}
          </View>
          {/* 第一层 */}
          <View style={styles.bar}>
            {this.generateFirstLevelRender()}
          </View>
          {/* 下方第二层 */}
          <View style={[{
            display: this.getMode() === "sub" && this.state.secondLevel ? 'flex' : 'none'
          }, styles.bar]}>
            {this.generateSecondLevelRender("sub")}
          </View>
          {/* 下方第三层 */}
          <View style={[
            { display: this.getMode() === "sub" && this.state.thirdLevel ? 'flex' : 'none' },
            styles.bar
          ]}>
            {this.generateThirdLevelRender("sub")}
          </View>
        </View>
        {this.props.button}

      </View >
    );
  }

  _onPress(action) {
    switch (action) {
      case actions.setBold:
      case actions.setItalic:
      case actions.insertBulletsList:
      case actions.insertOrderedList:
      case actions.setUnderline:
      case actions.heading1:
      case actions.heading2:
      case actions.heading3:
      case actions.heading4:
      case actions.heading5:
      case actions.heading6:
      case actions.setParagraph:
      case actions.removeFormat:
      case actions.alignLeft:
      case actions.alignCenter:
      case actions.alignRight:
      case actions.alignFull:
      case actions.setSubscript:
      case actions.setSuperscript:
      case actions.setStrikethrough:
      case actions.setHR:
      case actions.setIndent:
      case actions.setOutdent:
        this.state.editor._sendAction(action);
        break;
      case actions.insertLink:
        this.state.editor.prepareInsert();
        if (this.props.onPressAddLink) {
          this.props.onPressAddLink();
        } else {
          this.state.editor.getSelectedText().then(selectedText => {
            this.state.editor.showLinkDialog(selectedText);
          });
        }
        break;
      case actions.insertImage:
        this.state.editor.prepareInsert();
        if (this.props.onPressAddImage) {
          this.props.onPressAddImage();
        }
        break;
      case actions.frontInsert:  // 显示插入工具栏
      case actions.frontAlign:   // 显示对齐工具栏
      case actions.frontHeading: // 显示标题工具栏
      case actions.frontStyle:// 显示样式工具栏
        if (action === this.state.secondLevel) {
          this.cancelHighLightItem()
          this.setState({ secondLevel: null, thirdLevel: null })
        } else {
          this.highLightItem(action)
          this.setState({ secondLevel: action })
        }
        break;
      case actions.frontColor: // 显示颜色工具栏
        if (action === this.state.thirdLevel) {
          this.cancelHighLightItem(action)
          this.setState({ thirdLevel: null })
        } else {
          this.highLightItem(action)
          this.setState({ thirdLevel: action })
        }
        break
    }
  }
}

const styles = StyleSheet.create({
  defaultSelectedButton: {
    backgroundColor: 'red'
  },
  defaultUnselectedButton: {}
});
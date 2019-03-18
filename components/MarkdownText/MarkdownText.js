import React, { Component } from 'react'
import { View, Text, Button, WebView, TouchableOpacity, Alert, Dimensions } from 'react-native'
import WebViewBridge from 'react-native-webview-bridge-updated';
import RNFS from 'react-native-fs'


const html = `
<!DOCTYPE html>
<html lang=en><head>
  <meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge">
  <meta name=viewport content="width=device-width,initial-scale=1">
  <link rel=icon href=/favicon.ico>
  <title>vina-editor</title>
  <link href=file://${RNFS.MainBundlePath}/dist/bundle.js rel=preload as=script>
  <link href=file://${RNFS.MainBundlePath}/dist/static/css/index.css rel=preload as=style>
  <link href=file://${RNFS.MainBundlePath}/dist/static/css/index.css rel=stylesheet>
  
</head>
<body>
  <noscript>
    <strong>We're sorry but vina-editor doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript>
    <div id=app>
    </div>
    <script src=file://${RNFS.MainBundlePath}/dist/bundle.js>
    </script>
  </body>
  </html>
`

const injectScript = `
  (function () {
                if (WebViewBridge) {
                   WebViewBridge.onMessage = function (message) {
                   
                    if(window.GlobalEditor){
                      window.GlobalEditor.setTheme('dark')
                    }else{
                      conssolel.log("不存在editor")
                    }
                   if (message == "set-font") {
                    WebViewBridge.send("got the message inside webview");
                 }else{
                   WebViewBridge.send(message);
                 }
            };
                
          WebViewBridge.send("hello");
          
          }
          var el = document.getElementsByClassName("editor-wrapper")[0];
          el.style.height='${Dimensions.get('window').height}px';
         
     }());
`;

export default class Markdown extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log("Bundle路径:", RNFS.MainBundlePath)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* <View>
          <TouchableOpacity
            onPress={() => {
              this.webviewBridge.sendToBridge("set-font")
            }}
          >
            <View style={{ width: 50, height: 50, backgroundColor: 'orange', marginTop: 50 }}>

            </View>
          </TouchableOpacity>
        </View> */}
        <WebViewBridge
          originWhitelist={['*']}
          source={{
            html: html,
            baseURL: '/dist'
          }}
          hideKeyboardAccessoryView={true}
          keyboardDisplayRequiresUserAction={false}
          ref={(r) => { this.webviewBridge = r }}
          injectedJavaScript={injectScript}
          onBridgeMessage={(message) => console.log("收到消息", message)}
        />
      </View>
    )
  }
}
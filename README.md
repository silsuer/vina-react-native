# vina-react-native

出现问题

1. 删除 node_modules 重新 npm install

2. `lsof -i:8081 ` ,kill掉占用8081端口的程序，然后再编译程序

3. 连接真机试试

4. 重启电脑


### 依赖有手动修改的部分

 - [解决当使用富文本编辑器的时候报warning的问题](https://github.com/wix/react-native-zss-rich-text-editor/issues/79) 


 关于ListView: 
setState会触发render，但render未必导致ListView刷新
ListView有点特殊，必须修改datasource才会更新。datasource的修改必须通过调用cloneWith方法，这个方法多半是接受一个数组。这里就还存在一个问题，数组是引用型数据，所以如果你只在原数组上修改，其引用地址不会变，那么cloneWith方法会认为数组没有变化。所以你还需要想办法得到一个“新”数组。可以使用 setState({list:JSON.parse(JSON.stringfy(list))}) 这样就可以了

#### 真机在同一局域网下进行远程调试，控制台出现跨域错误

此时控制台窗口网址应该是 `localhost:8081`，将其改成电脑的内网地址（例如 `192.168.105.69:8081`），让真机与PC同源即可
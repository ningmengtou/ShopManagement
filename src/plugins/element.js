import Vue from 'vue'
import { Button,Form,FormItem,Input,Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// Message 需要全局挂载到Vue实例中
Vue.prototype.$message = Message



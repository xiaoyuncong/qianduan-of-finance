import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入 element 
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入axios
import axios from 'axios'
// 导入 qs
import qs from 'qs'
import VueCookies from 'vue-cookies'
var bus = new Vue()//新创建一个实例，用以传值
Vue.prototype.bus = bus//挂载在vue的原型上

Vue.use(VueCookies);



Vue.use(element);

// 允许携带cookie
axios.defaults.withCredentials = true;
// prototype：原型对象，所有的 JavaScript 对象都会从一个 prototype（原型对象）中继承属性和方法。
Vue.prototype.$axios = axios; // 将 axios 设置为 vue对象中的属性
Vue.prototype.$qs = qs;

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

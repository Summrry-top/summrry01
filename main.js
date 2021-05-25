import Vue from 'vue'
import App from './App'
import {http} from './common/api.js'
import store from './store'
Vue.config.productionTip = false

import uView from "uview-ui";
Vue.use(uView);

Vue.prototype.$http = http

Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()

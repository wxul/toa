console.log('begin!');
import { DEBUG } from '@utils/config';
import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css';
import ElUploadd from '@components/upload2';
import '@components/upload2/upload2.less';

Vue.use(ElementUI);
Vue.use(ElUploadd);
Vue.config.debug = DEBUG;

const app = new Vue({
    render: h => h(App)
}).$mount('#toa');

console.log('start!');
console.log('begin!');
import { DEBUG } from '@utils/config';
import Vue from 'vue';
import App from './App.vue';
import n from '@components/nav';

Vue.config.debug = DEBUG;

const app = new Vue({
    render: h => h(App)
}).$mount('#toa');

console.log('start!');
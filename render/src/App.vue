<template>
    <div class="app">
        <div class="nav">
            <header>广告位招租
                <i class="fa fa-spinner fa-pulse fa-fw"></i>
            </header>
            <nav-menu @section="section"></nav-menu>
            <footer>
                <a class="about" href="#">关于</a>
                <a data-openexternal="true" class="github" href="https://github.com/wxul/mytools-electron">
                    <i class="fa fa-github"></i> Github
                    <i class="fa fa-code-fork"></i>
                </a>
            </footer>
        </div>
        <div class="main">
            <transition name="fade" mode="out-in">
                <keep-alive>
                    <component v-bind:is="view"></component>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>
<script>
import '@assets/normalize.css';
import '@assets/global.css'
import '@assets/font-awesome/less/font-awesome.less';
import linksex from '@utils/openexlink.js';
import NavMenu from '@components/nav';
import Index from '@page/index.vue';
import QR from '@page/qr/qr.vue';
import QRDecode from '@page/qr/decode.vue';
import RssRead from '@page/rss/read';
import Media from '@page/other/media';

const electron = require("electron");
const ipc = electron.ipcRenderer;

export default {
    components: {
        NavMenu: NavMenu,
        Index: Index,
        QR: QR,
        QRDecode: QRDecode,
        RssRead: RssRead,
        Media: Media
    },
    data() {
        return {
            view: 'QRDecode'
        };
    },
    created() {
        ipc.on('print-screen-pressed', (e) => {
            this.view = 'QRDecode';
        })
    },
    mounted() {
        linksex.linksinit();
        this.view = 'Index';
    },
    methods: {
        section(i) {
            this.view = i;
        }
    }
};

</script>
<style lang="less">
.fade-enter-active,
.fade-leave-active {
    transition: all .18s;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
    transform: translate3d(-10px, 0, 0);
    visibility: hidden;
}

.main {
    // padding: 10px;
    position: relative;
}

@import './app.less';
</style>
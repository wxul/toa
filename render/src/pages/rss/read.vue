<template>
    <div class="rssread">
        <div class="rss-menu">
            <el-menu :default-active="activeRss" :unique-opened="true" @select="readrss">
                <li class="el-menu-item toolmenu" style="padding-left: 10px;">
                    <span>管理</span>
                    <div class="menus">

                    </div>
                </li>
                <el-submenu :index="f" v-for="(item,f) in warpped_rss" :key="f" v-if="f!='_nonefile_'">
                    <template slot="title"><i class="el-icon-message"></i> {{f}}</template>
                    <el-menu-item :index="r.url" v-for="(r,i) in item" :key="i" :title="r.name" v-text="r.name"></el-menu-item>
                </el-submenu>
                <el-menu-item :index="r.url" v-for="(r,i) in warpped_rss['_nonefile_']" :key="i" :title="r.name" v-text="r.name"></el-menu-item>
            </el-menu>
        </div>
        <div class="rss-content">
            <transition name="slide">
                <ul class="el-titles el-menu" v-show="!activeTopic">
                    <li class="el-menu-item updatetime" v-show="activeChannel && activeChannel.entries">更新于:123</li>
                    <li class="el-menu-item" v-for="item in activeChannel.entries" @click="activeTopic=item">
                        <time class="uptime">[{{item.pubDate}}]</time>
                        <p v-html="item.title"></p>
                    </li>
                </ul>
            </transition>

        </div>
    </div>
</template>
<script>
    const electron = require('electron');
    const ipc = electron.ipcRenderer;

    const rssparser = require('@utils/rssparser');

    export default {
        data() {
            return {
                rsslist: [],        // 所有rss源
                activeRss: '',      // 已选中rss的url
                channels: [],       // 所有已加载的rss频道
                activeChannel: {},  // 当前显示的rss频道
                activeTopic: null,  // 当前显示的文章
                pending: false,
                activeUrl: '',      // 已选中的rss的url
                rssdialog: {
                    add: false,
                    edit: false
                },
                addrssform: {
                    name: '',
                    rsscat: '无',
                    rsslink: ''
                },
                editrssform: {
                    name: '',
                    rsscat: '',
                    rsslink: ''
                }
            }
        },
        computed: {
            rss_categories() {
                if (!this.rsslist) return [];
                var t = [];
                var cat = {};
                this.rsslist.forEach((e, i) => {
                    var f = e.file;
                    if (!(f in cat)) {
                        cat[f] = [];
                        t.push({
                            n: f,
                            v: f
                        });
                    }
                    //cat[f].push(e);
                });
                t.push({
                    n: "无",
                    v: ""
                });
                return t;
            },
            warpped_rss() {
                if (!this.rsslist) return [];
                var cat = {};
                this.rsslist.forEach((e, i) => {
                    var f = e.file;
                    if (!f || f == '无') {
                        f = "_nonefile_";
                    }
                    if (!(f in cat)) {
                        cat[f] = [];
                    }
                    cat[f].push(e);

                });
                return cat;
            }
        },
        created() {
            this.loadrss();
        },
        methods: {
            loadrss() {
                var result = ipc.sendSync('rss-getlist');
                console.log(result);
                this.rsslist = result;
            },
            readrss(e) {
                this.activeRss = e;
                this.activeUrl = e;
                this.getRssInfo(e);
            },
            getRssInfo(url) {
                var temp = this.findRssByUrl(url);
                if (temp) {

                } else if (this.pending) {
                    return;
                } else {
                    this.pending = true;
                    rssparser({ url }).then(res => {
                        console.log(res);
                        this.channels.push({
                            url: url,
                            rss: res.feed
                        });
                        this.activeChannel = res.feed;
                        this.pending = false;
                    }).catch(e => {

                    });
                }

            },
            findRssByUrl(url) {
                var re = this.channels.filter(e => {
                    return e.url == url;
                })
                return re.length > 0 ? re[0] : null;
            }
        }
    }

</script>
<style lang="less">
    .rssread {
        height: 100%;
    }

    .rss-menu {
        display: flex;
        width: 100px;
        height: 100%;
        flex-direction: column;
        font-size: 12px;
        overflow-y: auto;
        overflow-x: hidden;
        min-width: 140px;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: #eef1f6;
        .el-menu-item {
            height: 32px;
            line-height: 32px;
            padding: 0 10px !important;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .el-submenu__title {
            padding-left: 10px !important;
            padding-right: 10px;
            height: 32px;
            line-height: 32px;
            .el-submenu__icon-arrow {
                right: 10px;
            }
        }
    }
</style>
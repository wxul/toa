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
                    <el-menu-item :index="r.url" v-for="(r,i) in item" :key="i" :title="r.name" v-text="r.name" :class="{loading:r.pending}"></el-menu-item>
                </el-submenu>
                <el-menu-item :index="r.url" v-for="(r,i) in warpped_rss['_nonefile_']" :key="i" :title="r.name" v-text="r.name" :class="{loading:r.pending}"></el-menu-item>
            </el-menu>
        </div>
        <div class="rss-content">
            <transition name="slide">
                <ul class="el-titles el-menu" v-show="!activeTopic && activeChannel.entries">
                    <li class="el-menu-item tt">{{activeChannel.title}}<span class="subtt"> - {{activeChannel.description}}</span></li>
                    <!-- <li class="el-menu-item updatetime" v-show="activeChannel && activeChannel.entries">更新于:123</li> -->
                    <li class="el-menu-item" v-for="item in activeChannel.entries" @click="activeTopic=item">
                        <time class="uptime">[{{item.pubDate|dateformat}}]</time>
                        <p v-html="item.title"></p>
                    </li>
                </ul>
            </transition>
            <transition name="slide">
                <div class="topic" v-show="activeTopic">
                    <el-button style="position: fixed;right:20px;top:10px;" size="mini" type="info" @click="activeTopic=null">返回</el-button>
                    <p class="title">
                        <a data-openexternal="true" :href="topic.link" v-html="topic.title"></a>
                    </p>
                    <p v-html="topic.content"></p>
                </div>
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
                rsslist: [], // 所有rss源
                activeRss: '', // 已选中rss的url
                channels: [], // 所有已加载的rss频道
                activeChannel: {}, // 当前显示的rss频道
                activeTopic: null, // 当前显示的文章
                pending: false,
                activeUrl: '', // 已选中的rss的url
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
        filters: {
            dateformat: function (v) {
                return new Date(v).toLocaleString();
            }
        },
        computed: {
            topic() {
                return this.activeTopic || {};
            },
            rss_categories() {
                if (!this.slist) return [];
                var t = [];
                var cat = {};
                this.slist.forEach((e, i) => {
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
                if (!this.slist) return [];
                var cat = {};
                this.slist.forEach((e, i) => {
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
            },
            slist() {
                return this.rsslist;
            }
        },
        created() {
            ipc.on('rss-readed', (e, o) => {
                console.log(o);
                this.rsslist = o.map(e => {
                    e.pending = false;
                    return e;
                });
            });
            this.loadrss();
        },
        methods: {
            loadrss() {
                ipc.send('rss-getlist');
            },
            readrss(e) {
                this.activeRss = e;
                this.activeUrl = e;
                this.getRssInfo(e);
            },
            getRssInfo(url) {
                var temp = this.findChannelByUrl(url);
                var rss = this.findRssByUrl(url);

                if (temp) {
                    this.activeChannel = temp.rss;
                } else if (rss.pending) {
                    return;
                } else {
                    rss.pending = true;
                    rssparser({
                        url
                    }).then(res => {
                        console.log(res);
                        this.channels.push({
                            url: url,
                            rss: res.feed
                        });
                        this.activeChannel = res.feed;
                        rss.pending = false;
                    }).catch(e => {

                    });
                }
            },
            findChannelByUrl(url) {
                return this.channels.find(e => {
                    return e.url == url;
                });
            },
            findRssByUrl(url) {
                return this.rsslist.find(e => {
                    return e.url == url;
                });
            }
        }
    }
</script>
<style lang="less">
    .rssread {
        height: 100%;
        display: flex;
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
        .loading {
            cursor: wait;
            /* pointer-events: none; */
        }
    }

    .rss-content {
        flex: 1;
        height: 100%;
        overflow-y: auto;
        .el-menu {
            background-color: #fff;
            .el-menu-item {
                line-height: 32px;
                height: 32px;
                &.tt {
                    line-height: 48px;
                    height: 48px;
                    color: #000;
                    font-size: 22px;
                    cursor: default;
                    &:hover {
                        background-color: #fff;
                    }
                    .subtt {
                        font-size: 18px;
                        color: #999;
                    }
                }
                .uptime {
                    float: right;
                }
            }
        }
        .topic {
            -webkit-user-select: text;
            padding: 10px;
            &>p.title {
                margin: 10px 0;
                padding-right: 60px;
                a {
                    text-decoration: none;
                    font-size: 22px;
                    font-weight: 600;
                    color: #000;
                    line-height: 28px;
                    &:hover {
                        color: #50bfff;
                    }
                }
            }
        }
    }
</style>
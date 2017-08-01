<template>
    <div class="rssread">
        <div class="rss-menu">
            <el-menu :default-active="activeRss" :unique-opened="true" @select="readrss">
                <li class="el-menu-item toolmenu" style="padding-left: 10px;">
                    <span>管理</span>
                    <div class="menus">
                        <span @click="rssdialog.add=true" title="添加RSS源">
                            <i class="fa fa-rss fa-fw"></i>
                        </span>
                        <span @click="rssedit" title="编辑">
                            <i class="fa fa-edit fa-fw"></i>
                        </span>
                        <span @click="rssreload" title="刷新">
                            <i class="fa fa-refresh fa-fw"></i>
                        </span>
                        <span @click="rssdel" title="删除当前">
                            <i class="fa fa-trash fa-fw"></i>
                        </span>
                    </div>
                </li>
                <el-submenu :index="f" v-for="(item,f) in wrapped_rss" :key="f" v-if="f!='_nofile_'">
                    <template slot="title">
                        <i class="el-icon-message"></i> {{f}}</template>
                    <el-menu-item :index="r.url" v-for="(r,i) in item" :key="i" :title="r.name" v-text="r.name" :class="{loading:r.pending}"></el-menu-item>
                </el-submenu>
                <el-menu-item :index="r.url" v-for="(r,i) in wrapped_rss['_nofile_']" :key="i" :title="r.name" v-text="r.name" :class="{loading:r.pending}"></el-menu-item>
            </el-menu>
        </div>
        <div class="rss-content" ref="rsscontent">
            <transition name="slide">
                <ul class="el-titles el-menu" v-show="!activeTopic && activeChannel.entries">
                    <li class="el-menu-item tt txt-ellipsis">{{activeChannel.title}}
                        <span class="subtt"> - {{activeChannel.description}}</span>
                    </li>
                    <!-- <li class="el-menu-item updatetime" v-show="activeChannel && activeChannel.entries">更新于:123</li> -->
                    <li class="el-menu-item" :title="item.title" v-for="(item,i) in wrapped_entries" @click="activeTopic=item" :key="i">
                        <time class="uptime">[{{item.pubDate|dateformat}}]</time>
                        <p class="txt-ellipsis" v-html="item.title"></p>
                    </li>
                </ul>
            </transition>
            <transition name="slide">
                <div class="topic" v-show="activeTopic">
                    <el-button style="position: fixed;right:20px;top:10px;" size="mini" type="info" @click="activeTopic=null">返回</el-button>
                    <p class="title">
                        <a data-openexternal="true" :href="topic.link" v-html="topic.title"></a>
                    </p>
                    <div v-html="topic.content" class="content"></div>
                </div>
            </transition>
        </div>
        <el-dialog title="添加" v-model="rssdialog.add">
            <el-form :model="addrssform">
                <el-form-item label="名称" label-width="70px">
                    <el-input v-model="addrssform.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类" label-width="70px">
                    <el-select v-model="addrssform.rsscat" filterable allow-create placeholder="请选择或输入分类">
                        <el-option v-for="(item,i) in rss_categories" :label="item.n" :value="item.v" :key="i">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="RSS源" label-width="70px">
                    <el-input v-model="addrssform.rsslink" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="rssdialog.add=false">取 消</el-button>
                <el-button type="primary" @click="handleAddRss">确 定</el-button>
            </div>
        </el-dialog>
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
                if (!f) {
                    f = '无';
                }
                if (!(f in cat)) {
                    cat[f] = [];
                    t.push({
                        n: f,
                        v: f
                    });
                }
                //cat[f].push(e);
            });
            // t.push({
            //     n: '无',
            //     v: ''
            // });
            return t;
        },
        wrapped_entries() {
            if (!this.activeChannel.entries || !this.activeChannel.entries instanceof Array) return [];
            return this.activeChannel.entries.sort((a, b) => {
                return (+new Date(b.pubDate)) - (+new Date(a.pubDate));
            });
        },
        wrapped_rss() {
            if (!this.slist) return [];
            var cat = {};
            this.slist.forEach((e, i) => {
                var f = e.file;
                if (!f || f == '无') {
                    f = '_nofile_';
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
    watch: {
        activeTopic: function (v, old) {
            this.$refs.rsscontent.scrollTop = 0;
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
        rssedit() {

        },
        rssreload() {

        },
        rssdel() {

        },
        handleAddRss() {

        },
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
@import './rss.less';
</style>
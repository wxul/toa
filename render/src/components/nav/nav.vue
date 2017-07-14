<template>
    <ul class="menu">
        <li class="menu-item">
            <a href="javascript:;" @click="section('Index')"><i class="fa fa-home fa-fw"></i> 主页</a>
        </li>
        <li class="menu-item has-sub">
            <a href="javascript:;" @click="select(1)" :class="{showactive:collapseall}">二维码</a>
            <collapse-transition>
                <ul class="submenu" v-show="collapseall || curindex==1">
                    <li class="menu-item">
                        <a href="javascript:;" @click="section('QR')"><i class="fa fa-qrcode fa-fw"></i> 生成</a>
                    </li>
                    <li class="menu-item">
                        <a href="javascript:;" @click="section('QRDecode')"><i class="fa fa-picture-o fa-fw"></i> 解码</a>
                    </li>
                </ul>
            </collapse-transition>
        </li>
        <li class="menu-item has-sub">
            <a href="javascript:;" @click="select(2)" :class="{showactive:collapseall}">信息</a>
            <collapse-transition>
                <ul class="submenu" v-show="collapseall || curindex==2">
                    <li class="menu-item"><a href="javascript:;"><i class="fa fa-rss-square fa-fw"></i> RSS</a></li>
                    <li class="menu-item"><a href="javascript:;"><i class="fa fa-envelope fa-fw"></i> 邮箱</a></li>
                </ul>
            </collapse-transition>
        </li>
        <li class="menu-item has-sub">
            <a href="javascript:;" @click="select(3)" :class="{showactive:collapseall}">HASH与压缩</a>
            <collapse-transition>
                <ul class="submenu" v-show="collapseall || curindex==3">
                    <li class="menu-item"><a href="javascript:;"><i class="fa fa-file-text fa-fw"></i> HASH</a></li>
                    <li class="menu-item"><a href="javascript:;"><i class="fa fa-file-code-o fa-fw"></i> JS压缩</a></li>
                </ul>
            </collapse-transition>
        </li>
        <li class="menu-item has-sub">
            <a href="javascript:;" @click="select(4)" :class="{showactive:collapseall}">待定</a>
            <collapse-transition>
                <ul class="submenu" v-show="collapseall || curindex==4">
                    <li class="menu-item"><a href="javascript:;"><i class="fa fa-spinner fa-pulse fa-fw"></i> 嗷！</a></li>
                </ul>
            </collapse-transition>
        </li>
    </ul>
</template>
<script>
    import CollapseTransition from '@components/other/collapse-transition';

    export default {
        name: 'NavMenu',
        componentName: 'NavMenu',
        components: {
            CollapseTransition
        },
        data() {
            return {
                curindex: -1,
                collapseall: true
            };
        },
        methods: {
            select(i) {
                this.curindex = this.curindex == i ? -1 : i;
            },
            section(i) {
                this.$emit('section', i);
            }
        }
    };

</script>
<style lang="less">
    @import './nav.less';
</style>
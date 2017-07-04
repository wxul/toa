<template>
    <div class="app">
        <div class="nav">
            <header>广告位招租 <i class="fa fa-spinner fa-pulse fa-fw"></i></header>
            <nav-menu></nav-menu>
            <footer>
                <a class="about" href="#">关于</a>
                <a data-openexternal="true" class="github" href="https://github.com/wxul/mytools-electron"><i class="fa fa-github"></i> Github <i class="fa fa-code-fork"></i></a>
            </footer>
        </div>
        <div class="main"></div>
    </div>
</template>
<script>
    import '@assets/normalize.css';
    import '@assets/global.css'
    import '@assets/font-awesome/less/font-awesome.less';
    import NavMenu from '@components/nav';

    export default {
        components: {
            NavMenu: NavMenu
        }
    };

</script>
<style lang="less">
    @import './app.less';
</style>
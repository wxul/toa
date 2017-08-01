<template>
    <div class="media">
        <input type="file" style="display:none" ref="file" @change="choosed">
        <button @click="choosefile">选择</button>
        <video ref="video" controls>
            <source :src="src" :type="type">
            <!-- <source src="C:\Users\wlj_3\Downloads\003vxqnwjx07b7BEpFrF010f11001HhV0k01.mp4" type="video/mp4"> -->
            <!-- <source src="D:\迅雷下载\Game.of.Thrones.S07E03.The.Queens.Justice.1080p.AMZN.WEBRip.DDP5.1.x264-GoT\Game.of.Thrones.S07E03.The.Queens.Justice.1080p.AMZN.WEB-DL.DD+5.1.H.264-GoT.mkv" type="video/webm">  -->
        </video>
    </div>
</template>
<script>
export default {
    data() {
        return {
            src: '',
            type: ''
        };
    },
    methods: {
        choosefile() {
            // console.log()
            this.$refs.file.click();
        },
        choosed(e) {
            var f = e.target.files[0];
            console.dir(f);
            // if (!this.$refs.video.canPlayType(f.type)) return alert('不支持的格式');
            this.src = f.path;
            this.type = f.type == 'video/x-matroska' ? 'video/webm' : f.type;
            this.$nextTick(() => {
                // this.$refs.video.volume = 1;
                this.$refs.video.load();
                // this.$refs.video.play();
            });
        }
    }
}
</script>
<style lang="less">
.media {
    position: relative;
    width: 100%;
    height: 100%;
    button {
        z-index: 22;
        position: absolute;
        left: 10px;
        top: 10px;
        background-color: white;
    }
    video {
        width: 100%;
        height: 100%;
    }
}
</style>
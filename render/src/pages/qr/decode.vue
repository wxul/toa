<template>
    <div class="qrdecode">
        <el-row :gutter="20">
            <el-col :span="19" :offset="1">
                <el-form label-width="80px">
                    <el-form-item label="图片">
                        <div class="upload2">
                            <el-uploadd action="/test.com" type="drag" :thumbnail-mode="true" :before-upload="uploadhandle" :on-preview="handlePreview"
                                :default-file-list="fileList">
                                <i class="el-icon-upload"></i>
                                <div class="el-dragger__text">将文件拖到此处，或<em>点击添加</em></div>
                                <div class="el-upload__tip" slot="tip">只能添加图片文件</div>
                            </el-uploadd>
                        </div>
                    </el-form-item>
                    <el-form-item label="热键">
                        使用 <code>Command/Control</code> + <code>Alt</code> + <code>Q</code> 截取屏幕上的二维码
                    </el-form-item>
                    <el-form-item label="解码">
                        <el-input type="textarea" v-model="decodetext" :rows="4" :spellcheck="false"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    var qrcode = require('exports-loader?qrcode!@utils/llqrcode.js');
    // import t from '@utils/llqrcode.js';
    const electron = require('electron');
    const ipc = electron.ipcRenderer;
    const desktopCapturer = electron.desktopCapturer;
    const electronScreen = electron.screen;
    export default {
        data() {
            return {
                decodetext: '',
                imgurl: '',
                fileList: [],
                imgdata: '',
                dialogVisible: false,
                screen: false
            }
        },
        created() {
            console.log(11);
            // 回调中获取解码结果
            qrcode.callback = (result) => {
                this.decodetext = result;
                if (this.screen && result !== 'error decoding QR Code') {
                    this.screen = false;
                    ipc.send('qr-screen-success');
                }
            };

            // 监听截图事件解码
            ipc.on('print-screen-pressed', e => {
                this.screen = true;
                var thumbSize = this.determineScreenShotSize();
                var options = {
                    types: ['screen'],
                    thumbnailSize: thumbSize
                };
                desktopCapturer.getSources(options, (err, sources) => {
                    if (err) return console.log(err);
                    sources.forEach((s) => {
                        if (s.name === 'Entire screen' || s.name === 'Screen 1') {
                            var base64 = s.thumbnail.toDataURL();

                            this.fileList = [{
                                name: 'screenshot',
                                url: base64
                            }];
                            qrcode.decode(base64);
                        }
                    })
                });
            });
        },
        methods: {
            determineScreenShotSize() {
                const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
                const maxDimension = Math.max(screenSize.width, screenSize.height)
                return {
                    width: maxDimension * window.devicePixelRatio,
                    height: maxDimension * window.devicePixelRatio
                }
            },
            decodeImg(filename, result) {
                this.imgdata = result;
                this.fileList = [{
                    name: filename,
                    url: result
                }];
                qrcode.decode(result);
            },
            uploadhandle(file) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.decodeImg(file.name, e.target.result);
                }
                reader.readAsDataURL(file);
                return false;
            },
            handlePreview(file) {
                this.LoadImage(file.url).then((img) => {
                    ipc.send("show-img-window", {
                        url: file.url,
                        name: file.name,
                        width: img.width,
                        height: img.height
                    });
                });
            },
            LoadImage(imgSrc) {
                return new Promise((resolve, reject) => {
                    var image = new Image();
                    image.src = imgSrc;
                    if (image.complete) {
                        resolve(image);
                        image.onload = function () { };
                    } else {
                        image.onload = function () {
                            resolve(image);
                            // clear onLoad, IE behaves erratically with animated gifs otherwise
                            image.onload = function () { };
                        }
                        image.onerror = function (e) {
                            log('Could not load image.');
                            reject(e);
                        }
                    }
                });

            },
        }
    };

</script>
<style></style>
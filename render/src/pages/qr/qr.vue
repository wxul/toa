<template>
    <div class="qrcode">
        <div class="nav">
            <ul class="menu">
                <li class="menu-item">
                    <a href="javascript:;" @click="tab('txt')">
                        <i class="fa fa-file-text-o fa-fw"></i> 文本</a>
                </li>
                <li class="menu-item has-sub">
                    <a href="javascript:;" @click="tab('site')">
                        <i class="fa fa-link fa-fw"></i> 网站</a>
                </li>
                <li class="menu-item has-sub">
                    <a href="javascript:;" @click="tab('tel')">
                        <i class="fa fa-phone fa-fw"></i> 电话</a>
                </li>
                <li class="menu-item has-sub">
                    <a href="javascript:;" @click="tab('email')">
                        <i class="fa fa-envelope-o fa-fw"></i> 邮箱</a>
                </li>
                <li class="menu-item has-sub">
                    <a href="javascript:;" @click="tab('card')">
                        <i class="fa fa-id-card-o fa-fw"></i> 名片</a>
                </li>
                <li class="menu-item has-sub">
                    <a href="javascript:;" @click="tab('wifi')">
                        <i class="fa fa-wifi fa-fw"></i> WIFI</a>
                </li>
                <li class="menu-item has-sub">
                    <a href="javascript:;" @click="tab('sms')">
                        <i class="fa fa-commenting-o fa-fw"></i> 短信</a>
                </li>
                <li class="menu-item has-sub">
                    <a href="javascript:;" @click="tab('effect')">
                        <i class="fa fa-snowflake-o fa-fw"></i> 效果</a>
                </li>
            </ul>
        </div>
        <div class="ctx-items">
            <transition name="fade" mode="out-in">
                <div class="ctx-item" :key="0" v-if="cur_tab=='txt'">
                    <el-input type="textarea" placeholder="请输入内容" :rows="6" v-model="txt"></el-input>
                </div>
                <div class="ctx-item" :key="1" v-if="cur_tab=='site'">
                    <el-input placeholder="请输入内容" v-model="url">
                        <el-select v-model="select" slot="prepend" style="width:90px;" placeholder="请选择">
                            <el-option label="http://" value="1"></el-option>
                            <el-option label="https://" value="2"></el-option>
                        </el-select>
                    </el-input>
                </div>
                <div class="ctx-item" :key="2" v-if="cur_tab=='tel'">
                    <el-input placeholder="请输入电话号码" v-model="tel"></el-input>
                </div>
                <div class="ctx-item" :key="3" v-if="cur_tab=='email'">
                    <el-input placeholder="请输入邮箱" v-model="email">
                    </el-input>
                </div>
                <div class="ctx-item" :key="4" v-if="cur_tab=='card'">
                    <el-form ref="form" :model="MECARD" label-width="40px">
                        <el-form-item label="姓名">
                            <el-input v-model="MECARD.N"></el-input>
                        </el-form-item>
                        <el-form-item label="地址">
                            <el-input v-model="MECARD.ADR"></el-input>
                        </el-form-item>
                        <el-form-item label="电话">
                            <el-input v-model="MECARD.TEL"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model="MECARD.EMAIL"></el-input>
                        </el-form-item>
                        <el-form-item label="网址">
                            <el-input v-model="MECARD.URL"></el-input>
                        </el-form-item>
                        <el-form-item label="QQ">
                            <el-input v-model="MECARD.QQ"></el-input>
                        </el-form-item>
                        <el-form-item label="职位">
                            <el-input v-model="MECARD.TIL"></el-input>
                        </el-form-item>
                        <el-form-item label="单位">
                            <el-input v-model="MECARD.ORG"></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="MECARD.NOTE" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="ctx-item" :key="5" v-if="cur_tab=='wifi'">
                    <el-form ref="form" :model="WIFI" label-width="80px">
                        <el-form-item label="SSID">
                            <el-input v-model="WIFI.S"></el-input>
                        </el-form-item>
                        <el-form-item label="加密方式">
                            <el-select v-model="WIFI.T" placeholder="请选择" @change="wifichange">
                                <el-option v-for="(item,i) in Toptions" :key="i" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="WIFI.P" :disabled="WIFI.T=='nopass'"></el-input>
                        </el-form-item>
                        <el-form-item label="是否隐藏">
                            <el-switch v-model="WIFI.H" on-text="是" off-text="否" on-color="#13ce66" off-color="#ff4949">
                            </el-switch>
                        </el-form-item>
    
                    </el-form>
                </div>
                <div class="ctx-item" :key="6" v-if="cur_tab=='sms'">
                    <el-form ref="form" :model="SMS" label-width="80px">
                        <el-form-item label="手机号码">
                            <el-input v-model="SMS.Tel" placeholder="请输入手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="短信内容">
                            <el-input v-model="SMS.NOTE" placeholder="请输入短信内容" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="ctx-item" :key="7" v-if="cur_tab=='effect'">
                    <el-form ref="form" :model="other" label-width="80px">
                        <el-form-item label="样式">
                            <el-slider style="width:90%;" v-model="other.round" :min="-50" :max="50"></el-slider>
                        </el-form-item>
                        <el-form-item label="背景色">
                            <div class="inline">
                                前景色
                                <color-picker v-model="other.fgcolor"></color-picker>
                            </div>
                            <div class="inline">
                                背景色
                                <color-picker v-model="other.bgcolor"></color-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="定位点色">
                            <div class="inline">
                                外框定位点
                                <color-picker v-model="other.ptcolor"></color-picker>
                            </div>
                            <div class="inline">
                                内点定位点
                                <color-picker v-model="other.inptcolor"></color-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="渐变">
                            <div class="inline">
                                渐变色
                                <color-picker v-model="other.gccolor"></color-picker>
                            </div>
                            <div class="inline">
                                渐变方式
                                <el-select style="width:100px;" size="small" v-model="other.gctype" placeholder="请选择">
                                    <el-option v-for="(item,i) in other.gctypes" :key="i" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item label="嵌入图标">
                            <el-select style="width:80px;" size="small" v-model="other.logotype" placeholder="请选择" @change="onLogoTypeChange">
                                <el-option v-for="(item,i) in other.logotypes" :key="i" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <input type="file" style="display:none;" ref="logo" accept="image/*" @change="logoselect" />
                            <el-button type="primary" size="small" @click="handleLogo">选择图片</el-button>
                            <span>
                                <br/> {{other.logo.logoimg && other.logo.logoimg.target.files[0].name}}</span>
                        </el-form-item>
                        <el-form-item label="其它设置">
                            <div class="inline">
                                外边距
                                <el-select style="width:75px;" size="small" v-model="other.margin" placeholder="请选择">
                                    <el-option v-for="(item,i) in other.margins" :key="i" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="inline">
                                纠错等级
                                <el-select style="width:75px;" size="small" :disabled="other.levellock" v-model="other.level" placeholder="请选择">
                                    <el-option v-for="(item,i) in other.levels" :key="i" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="inline">
                                旋转
                                <el-select style="width:75px;" size="small" v-model="other.rotate" placeholder="请选择">
                                    <el-option v-for="(item,i) in other.rotates" :key="i" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </transition>
            <el-button type="primary" class="draw" @click="handleDraw">{{cur_tab=='effect'?"清除":"生成"}}</el-button>
        </div>
        <div class="resultimg">
            <div class="cc">
                <canvas id="canvas"></canvas>
            </div>
            <el-button style="margin:0 auto;" type="primary" size="small" @click="handleSave">保存图片</el-button>
            <a :href="dl.base64" :download="dl.name" style="display:none;" ref="btna"></a>
        </div>
    </div>
</template>
<script>
import createQRImage from '@utils/qrcanvas';
import cp from '@components/colorpicker';

export default {
    components: {
        ColorPicker: cp
    },
    data() {
        return {
            cur_tab: 'txt',
            form: {},
            activeName: '',
            canvas: null,
            txt: '',
            url: '',
            select: '1',
            tel: '',
            email: '',
            MECARD: {
                N: '',      // 姓名
                ADR: '',    // 地址
                TEL: '',    // 电话
                EMAIL: '',  // 邮箱
                URL: '',    // 网址
                QQ: '',     // QQ
                TIL: '',    // 职位
                ORG: '',    // 单位
                NOTE: ''    // 备注
            },
            WIFI: {
                S: '',      // SSID
                P: '',      // Password
                T: 'WPA',   // type,WEP/WPA/nopass
                H: false    // 是否隐藏
            },
            Toptions: [{
                value: 'nopass',
                label: '无加密'
            }, {
                value: 'WEP',
                label: 'WEP'
            }, {
                value: 'WPA',
                label: 'WPA/WPA2'
            }],
            SMS: {
                Tel: '',
                NOTE: ''
            },
            dl: {
                base64: '',
                name: '二维码.png'
            },
            other: {
                round: 0,
                fgcolor: '#000',
                bgcolor: '#fff',
                ptcolor: '#000',
                inptcolor: '#000',
                gccolor: '#000',
                gctype: 'circular',
                gctypes: [{
                    label: '无',
                    value: '0'
                }, {
                    label: '反斜线',
                    value: 'backslash'
                }, {
                    label: '斜线',
                    value: 'slash'
                }, {
                    label: '圆形',
                    value: 'circular'
                }, {
                    label: '水平',
                    value: 'horizontal'
                }, {
                    label: '垂直',
                    value: 'vertical'
                }],
                margin: 10,
                margins: [{
                    label: '0',
                    value: 0
                }, {
                    label: '10px',
                    value: 10
                }, {
                    label: '20px',
                    value: 20
                }, {
                    label: '25px',
                    value: 25
                }],
                level: 'L',
                levellock: false,
                levels: [{
                    label: '最低',
                    value: 'L'
                }, {
                    label: '低',
                    value: 'M'
                }, {
                    label: '中',
                    value: 'Q'
                }, {
                    label: '高',
                    value: 'H'
                }],
                rotate: '0',
                rotates: [{
                    label: '0',
                    value: '0'
                }, {
                    label: '90°',
                    value: '1'
                }, {
                    label: '180°',
                    value: '2'
                }, {
                    label: '270°',
                    value: '3'
                }],
                logo: {
                    logoimg: '',
                    logotype: ''
                },
                logotype: 'default',
                logotypes: [{
                    label: '圆角',
                    value: 'icon'
                }, {
                    label: '白底',
                    value: 'border'
                }, {
                    label: '描边',
                    value: 'stroke'
                }, {
                    label: '原图',
                    value: 'default'
                }]
            }
        }
    },
    computed: {
        mecard() {
            return this.formatter('MECARD');
        },
        wifi() {
            return this.formatter('WIFI');
        },
        sms() {
            return `smsto:${this.SMS.Tel}:${this.SMS.NOTE}`
        }
    },
    watch: {
        'other.round': function (v, old) {
            this.canvas.changeRound(v < 0, Math.abs(v) / 100);
        },
        'other.fgcolor': function (v, old) {
            this.canvas.changeFgColor(v);
        },
        'other.bgcolor': function (v, old) {
            this.canvas.changeBgColor(v);
        },
        'other.ptcolor': function (v, old) {
            this.canvas.changePtColor(v);
        },
        'other.inptcolor': function (v, old) {
            this.canvas.changeInPtColor(v);
        },
        'other.gccolor': function (v, old) {
            this.canvas.changeGcColor(this.other.gctype, v);
        },
        'other.width': function (v, old) {
            this.canvas.changeWidth(v);
        },
        'other.rotate': function (v, old) {
            this.canvas.changeRotate(v);
        },
        'other.level': function (v, old) {
            this.canvas.changeLevel(v);
        },
        'other.margin': function (v, old) {
            this.canvas.changeMargin(v);
        },
        'other.gctype': function (v, old) {
            this.canvas.changeGradientWay(v, this.other.gccolor);
        }
    },
    mounted() {
        this.canvas = new createQRImage('canvas');
        // console.log(this.canvas);
        this.canvas.changeText('https://albert.amayading.com');
    },
    methods: {
        tab(i) {
            this.cur_tab = i;
        },
        setH() {
            this.other.level = 'H';
            this.other.levellock = true;
        },
        onLogoTypeChange(e) {
            if (!this.other.logo.logoimg) return;
            this.canvas.changeLogoimg(this.other.logo.logoimg, e);
            this.setH();
        },
        logoselect(e) {
            this.other.logo.logoimg = e;
            this.canvas.changeLogoimg(e, this.other.logotype);
            this.setH();
        },
        handleLogo() {
            this.$refs.logo.click();
        },
        wifichange(e) {
            if (e == 'nopass') {
                this.WIFI.P = '';
            }
        },
        formatter(objName) {
            var obj = this[objName];
            var tmp = '';
            Object.keys(obj).forEach((e, i) => {
                var val = obj[e];
                if (!!val) {
                    tmp += `${e}:${val};`;
                }
            })
            return `${objName}:${tmp};`;
        },
        handleDraw() {
            switch (this.cur_tab) {
                case 'txt':
                    this.canvas.changeText(this.txt);
                    break;
                case 'site':
                    this.canvas.changeText((this.select == 1 ? 'http://' : 'https://') + this.url);
                    break;
                case 'tel':
                    this.canvas.changeText(`tel:${this.tel}`);
                    break;
                case 'email':
                    this.canvas.changeText(`mailto:${this.email}`);
                    break;
                case 'card':
                    this.canvas.changeText(this.mecard);
                    break;
                case 'wifi':
                    this.canvas.changeText(this.wifi);
                    break;
                case 'sms':
                    this.canvas.changeText(this.sms);
                    break;
                case 'effect': //清除设置
                    this.canvas.resetAll();
                    this.resetAll();
                    break;
                default:
                    break;
            }
        },
        resetAll() {
            this.other.round = 0;
            this.other.fgcolor = '#000';
            this.other.bgcolor = '#fff';
            this.other.ptcolor = '#000';
            this.other.inptcolor = '#000';
            this.other.gccolor = '#000';
            this.other.gctype = 'circular';
            this.other.margin = 10;
            this.other.level = 'L';
            this.other.levellock = false;
            this.other.rotate = '0';
            this.other.logo = {
                logoimg: '',
                logotype: ''
            }
        },
        handleClick() {
            //console.log(createQRImage);
        },
        handleSave() {
            this.dl.base64 = document.getElementById('canvas').toDataURL('image/png');
            this.$nextTick(function () {
                this.$refs.btna.click();
            })
        }
    }
};
</script>
<style lang="less">
.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.qrcode {
    display: flex;
    min-height: 100%;
    height: 100%;
    .draw.el-button {
        margin-top: 20px;
        float: right;
    }
    .el-form-item__label {
        color: #ccc;
    }
    .tab-url .el-select .el-input {
        width: 90px;
    }
    .tab-card .el-form .el-form-item,
    .tab-wifi .el-form .el-form-item,
    .tab-sms .el-form .el-form-item,
    .tab-other .el-form .el-form-item {
        margin-bottom: 10px;
    }
    .inline {
        display: inline-block;
        margin-right: 10px;
    }
    #canvas {
        box-shadow: 0 0 4px #333;
        max-width: 100%;
    }
    .nav {
        background-color: transparent;
        width: 90px;
        padding-top: 50px;
        .menu .menu-item a {
            line-height: 40px;
        }
    }
    .ctx-items {
        display: flex;
        width: 400px;
        flex-direction: column;
        padding: 15px;
        .ctx-item {
            box-sizing: border-box;
            width: 100%;
        }
        .draw {
            float: none;
            display: inline-block;
        }
    }
    .resultimg {
        flex: 1;
        padding: 15px;
        padding-left: 0;
        .cc {
            width: 100%;
            max-width: 500px;
            box-sizing: border-box;

            canvas {
                width: 100%;
            }
        }
    }
}
</style>
<template>
    <div class="color-picker">
        <el-tooltip placement="top" :manual="true" :value="show" popper-class="elpicker">
            <div slot="content">
                <chrome v-model="cmodel"></chrome>
            </div>
            <div class="colordiv" :style="{backgroundColor:color}" @click="e=>{show=!show;e.stopPropagation();}"></div>
        </el-tooltip>
    </div>
</template>
<script>
import { Chrome } from 'vue-color';

export default {
    name: 'ColorPicker',
    props: ['value'],
    components: {
        Chrome: Chrome
    },
    mounted() {
        document.addEventListener('click', (e) => {
            this.show = false;
        })
    },
    data() {
        return {
            show: false,
            val: this.value,
            cmodel: ''
        }
    },
    computed: {
        color: {
            get() {
                return this.val;
            },
            set(newVal) {
                this.val = newVal;
                this.$emit('input', newVal);
            }
        }
    },
    watch: {
        value: function (v, old) {
            this.val = v;
        },
        cmodel: function (v, old) {
            this.color = v.hex;
        }
    }
}
</script>
<style>
.color-picker {
    display: inline-block;
    vertical-align: middle;
}

.color-picker .colordiv {
    width: 20px;
    height: 20px;
    cursor: pointer;
    vertical-align: middle;
    box-shadow: rgb(51, 51, 51) 0px 0px 2px;
}

.color-picker .el-tooltip__rel {
    vertical-align: middle;
}
</style>
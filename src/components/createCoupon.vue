<template>
    <div>
        <public_header :title='this.$route.params.title'></public_header>
        <div class='create_full'>
            <div v-if="isFullCoupon">
                <div class="full-sale-title">
                    满减规则
                </div>
                <div class="full-sale-content">
                    <label>消费满</label>
                    <input type="number" v-model='value1' oninput="if(value.length>9)value=value.slice(0,9)"/>
                    <label>元,&nbsp;减</label>
                    <input type="number" v-model='value2' oninput="if(value.length>6)value=value.slice(0,6)"/>
                    <label>元</label>
                </div>
            </div>
            <div class='full_rule discount' v-if='isFoldCoupon'>
                <label>折扣</label>
                <input @click="popupVisible = true" v-model='value1' placeholder="请输入折扣" readonly>
                <span>折</span>
            </div>
            <div class='full_rule'>
                <label>生效日期</label>
                <a class='startTime' @click="openPicker('pickerStart')">{{start_date}}</a>
                <a class='endTime' @click="openPicker('pickerEnd')">{{end_date}}</a>
            </div>
            <div class='full_rule'>
                <label>适用时段</label>
                <a class='startTime' @click="openPicker('timeStartPicker')">{{start_time}}</a>
                <a class='endTime' @click="openPicker('timeEndPicker')">{{end_time}}</a>
            </div>
            <weeks></weeks>
            <div class='submitBtn' @click="submit">提交</div>
            <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
                <mt-picker :slots="dateSlots" @change="onDateChange" :visible-item-count="5" :show-toolbar="true">
                    <span class="mint-datetime-action mint-datetime-cancel" @click="popupVisible = false">取消</span>
                    <span class="mint-datetime-action mint-datetime-confirm" @click="confirm">确认</span>
                </mt-picker>
            </mt-popup>
            <mt-datetime-picker ref="pickerStart" :startDate='dateLimitStart' type="date" year-format="{value} 年"
                                month-format="{value} 月" date-format="{value} 日" @confirm="startChange">
            </mt-datetime-picker>
            <mt-datetime-picker ref="pickerEnd" :startDate='dateLimitStart' type="date" year-format="{value} 年"
                                month-format="{value} 月" date-format="{value} 日" @confirm="endChange">
            </mt-datetime-picker>
            <mt-datetime-picker ref="timeStartPicker" type="time" @confirm="timeStartChange">
            </mt-datetime-picker>
            <mt-datetime-picker ref="timeEndPicker" type="time" @confirm="timeEndChange">
            </mt-datetime-picker>
            <mt-popup v-model="popupVisibleFail" position="top" class="mint-popup-fail" :modal="false">{{errorMsg}}
            </mt-popup>
            <mt-popup v-model="popupVisibleSuccess" position="top" class="mint-popup-success" :modal="false">{{successMsg}}
            </mt-popup>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        DatetimePicker,
        Popup
    } from 'mint-ui';
    import public_header from './public_header.vue'
    import weeks from './weeks.vue'
    import config from '../common/js/config.js';
    Vue.component(DatetimePicker.name, DatetimePicker);
    Vue.component(Popup.name, Popup);
    export default {
        data() {
            return {
                value1: null,
                value2: null,
                backValue1: null, //给后台传，是value1的100倍或10倍
                backValue2: null, //给后台传，是value2的100倍
                start_date: null,
                end_date: null,
                discountRate: null,
                popupVisible: false,
                popupVisibleFail: false,
                popupVisibleSuccess: false,
                errorMsg: '',
                successMsg: '',
                start_time: '08:00',
                end_time: '23:59',
                daysOfWeek: '',
                dateSlots: [{
                    flex: 1,
                    values: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
                    className: 'slot1',
                    textAlign: 'center'
                }, {
                    divider: true,
                    content: '·',
                    className: 'slot2'
                }, {
                    flex: 1,
                    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                    className: 'slot3',
                    textAlign: 'center'
                }],
                saleValue: null
            }
        },
        computed: {
            //不要用ES6，他不是vue实例的语法
            isFullCoupon: function () {
                return this.$route.params.type == '1' ? true : false;
            },
            isFoldCoupon: function () {
                return this.$route.params.type == '2' ? true : false;
            },
            dateLimitStart: function () {
                return new Date();
            }
        },
        mounted() {
            this.dateLimitStart = new Date();
            this.start_date = new Date().Format('yyyy-MM-dd');
            let myDate = new Date();
            this.end_date = new Date(myDate.setMonth(myDate.getMonth() + 1)).Format('yyyy-MM-dd');
            this.value1 = null
        },
        components: {
            public_header: public_header,
            weeks: weeks
        },
        watch: {
            popupVisibleFail(val) {
                if (val) {
                    setTimeout(() => {
                        this.popupVisibleFail = false;
                    }, 1500);
                }
            },
            popupVisibleSuccess(val) {
                if (val) {
                    setTimeout(() => {
                        this.popupVisibleSuccess = false;
                    }, 1500);
                }
            }
        },
        methods: {
            confirm() {
                if (this.saleValue === "0.0") {
                    this.errorMsg = "打折数字不能选择0.0";
                    this.popupVisibleFail = true;
                    return
                }
                this.popupVisible = false;
                if (this.saleValue) {
                    this.value1 = this.saleValue;
                }
            },
            openPicker(pickerRef) {
                this.$refs[pickerRef].open();
            },
            startChange(value) {
                this.start_date = value.Format('yyyy-MM-dd')
            },
            endChange(value) {
                this.end_date = value.Format('yyyy-MM-dd')
            },
            timeStartChange(value) {
                this.start_time = value;
            },
            timeEndChange(value) {
                this.end_time = value;
            },
            onDateChange(picker, values) {
                if (values[0] === undefined) {
                    values[0] = "0"
                }
                if (values[1] === undefined) {
                    values[1] = "0"
                }
                this.saleValue = values[0] + '.' + values[1];
            },
            submit() {
                // 转化week格式
                if (this.$children[1]._data.allDay == true) {
                    this.daysOfWeek = '1#2#3#4#5#6#7';
                } else {
                    this.daysOfWeek = this.Util.formatWeek(this.$children[1]._data)
                }
                // 如果是创建满减
                if (this.$route.params.type == '1') {
                    const reg = /^\d+(\.\d{1,2})?$/;
                    if (!reg.test(this.value1) || !reg.test(this.value2)) {
                        this.errorMsg = "请输入1-100000之间的数字，最多两位小数";
                        this.popupVisibleFail = true;
                        return;
                    } else if ((this.value1 < 1 || this.value1 > 100000) || (this.value2 < 1 || this.value2 > 100000)) {
                        this.errorMsg = "请输入1-100000之间的数字，最多两位小数";
                        this.popupVisibleFail = true;
                        return;
                    } else if (this.value1 - this.value2 < 0) {
                        this.errorMsg = "满减金额不能大于门槛金额";
                        this.popupVisibleFail = true;
                        return;
                    } else {
                        this.backValue1 = this.value1 * 100;
                        this.backValue2 = this.value2 * 100;
                    }
                } else {
                    if (this.value1) {
                        this.backValue1 = this.value1 * 10;
                    } else {
                        this.errorMsg = "请输入折扣";
                        this.popupVisibleFail = true;
                        return;
                    }

                }
                // 开始时间不能大于结束日期
                if (this.end_date < this.start_date) {
                    this.errorMsg = '结束日期不能小于开始日期';
                    this.popupVisibleFail = true;
                    return;
                } else if (this.end_date == this.start_date) { //如果是当天，则判断是否是当前时间的半小时后
                    if (new Date(this.start_date + ' ' + this.start_time) - new Date() < 1800000) {
                        this.errorMsg = '如创建当天券，开始时间必须为当前时间的半小时后';
                        this.popupVisibleFail = true;
                        return;
                    } else if (this.end_time <= this.start_time) {
                        this.errorMsg = '结束时间不能小于开始时间';
                        this.popupVisibleFail = true;
                        return;
                    }
                } else { // 开始时间不能大于等于结束时间
                    if (this.end_time <= this.start_time) {
                        this.errorMsg = '结束时间不能小于开始时间';
                        this.popupVisibleFail = true;
                        return;
                    }
                }

                if (!this.daysOfWeek) {
                    this.errorMsg = '请选择适用星期';
                    this.popupVisibleFail = true;
                    return
                }

                console.log(this.$route.params.type, this.backValue1, this.backValue2, this.start_date, this.end_date, this.start_time, this.end_time, this.daysOfWeek)
                this.$http({
                    method: 'post',
                    url: config.baseUrl + '/api/discountPayment/save/',
                    data: {
                        type: this.$route.params.type,
                        value1: this.backValue1,
                        value2: this.backValue2,
                        start_date: this.start_date,
                        end_date: this.end_date,
                        start_time: this.start_time,
                        end_time: this.end_time,
                        daysOfWeek: this.daysOfWeek
                    }
                }).then((response) => {
                    if (response.data.code === '0' && response.data.eCode === '0') {
                        // this.successMsg = "创建成功";
                        // this.popupVisibleSuccess = true;
                        router.push({
                            name: 'home'
                        })
                        return;
                    } else {
                        this.errorMsg = response.data.msg;
                        this.popupVisibleFail = true;
                        return;
                    }
                })
            }
        }
    }
</script>
<style scoped lang='less'>
    .create_full {
        position: absolute;
        width: 100%;
        .discount {
            input {
                font-size: .26rem;
                color: #424242;
                letter-spacing: 1px;
            }

            span {
                font-size: 0.26rem;
                color: #424242;
                letter-spacing: 0.6px;
                line-height: 0.44rem;
                float: right;
                margin: 0.22rem 0.3rem 0 0;
            }
        }

        .full-sale-title {
            height: 0.81rem;
            line-height: 0.81rem;
            font-size: 0.26rem;
            letter-spacing: 0.6px;
            background: #FFFFFF;
            padding: 0 0 0 0.3rem;
            color: #909090;
            border-bottom: 1px solid #E5E5E5;
        }

        .full-sale-content {
            font-size: 0.26rem;
            color: #424242;
            letter-spacing: 0.6px;
            line-height: 1.32rem;
            height: 1.32rem;
            padding: 0 0 0 0.3rem;
            background: #FFFFFF;

            input {
                width: 2rem;
                height: 0.72rem;
                border: 0.02rem solid #E5E5E5;
                border-radius: 6px;
                text-align: center;
                font-size: 0.3rem;
                color: #424242;
                letter-spacing: 1px;
                line-height: 0.44rem;
            }
        }

        .full_rule {
            margin-top: .21rem;
            height: .88rem;
            line-height: .35rem;
            background: #fff;

            label {
                color: #909090;
                display: inline-block;
                width: 1.07rem;
                height: .4rem;
                line-height: .4rem;
                margin: auto 0.9rem auto .3rem;
                font-size: .26rem;
            }

            span {
                font-size: .26rem;
                color: #424242;

                input {
                    width: 1.8rem;
                    height: .4rem;
                    line-height: .4rem;
                    font-size: .3rem;
                    text-align: center;
                    color: #424242;
                    letter-spacing: 1px;
                }
            }

            .startTime {
                display: inline-block;
                width: 2rem;
                font-size: .3rem;
                color: #424242;
                letter-spacing: 1px;
                line-height: 0.44rem;
            }

            .endTime {
                display: inline-block;
                border-left: 1px solid #E5E5E5;
                width: 2rem;
                font-size: .3rem;
                color: #424242;
                letter-spacing: 1px;
                line-height: 0.44rem;
                padding: 0 0 0 0.3rem;
            }
        }

        .submitBtn {
            font-size: .3rem;
            color: #FFFFFF;
            letter-spacing: 1px;
            text-align: center;
            background: rgba(255, 130, 0, 1);
            position: fixed;
            bottom: 0;
            height: .96rem;
            width: 100%;
            line-height: .96rem;
        }
    }
</style>

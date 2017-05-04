<template>
    <div class="coupon-detail">
        <header>
            <public_header :title='this.$route.params.title'></public_header>
        </header>
        <article>
            <div class="coupon-detail-content" v-if="this.$route.params.type === '1'">
                <label>满减规则</label>
                <p>
                    消费满&nbsp;<span>{{fullMount}}</span>&nbsp;元,&nbsp;减&nbsp;<span>{{discountMount}}</span>&nbsp;元
                </p>
            </div>
            <div class="coupon-detail-content" v-if="this.$route.params.type === '2'">
                <label>折扣</label>
                <p>
                    <span>{{fullMount}}</span>折
                </p>
            </div>
            <div class="coupon-detail-content">
                <label>生效日期</label>
                <p>
                    <span>{{startDate}}</span>&nbsp;至&nbsp;<span>{{endDate}}</span>
                </p>
            </div>
            <div class="apply-period-content">
                <label>适用时段</label>
                <p>
                    <span>{{startTime}}</span>&nbsp;至&nbsp;<span>{{endTime}}</span>
                </p>
                <p>{{daysOfWeek}}</p>
            </div>
        </article>
        <footer>
            <div class='submitBtn' @click="cancel">终止活动</div>
        </footer>
        <mt-popup v-model="popupVisibleFail" position="top" class="mint-popup-fail" :modal="false">{{errorMsg}}
        </mt-popup>
        <mt-popup v-model="popupVisibleSuccess" position="top" class="mint-popup-success" :modal="false">{{successMsg}}
        </mt-popup>
    </div>
</template>
<script>
    import Vue from 'vue';
    import public_header from './public_header.vue'
    import {
        MessageBox,
        Popup,
        Indicator
    } from 'mint-ui'
    import config from '../common/js/config.js';
    Vue.component(MessageBox.name, MessageBox);
    Vue.component(Popup.name, Popup);
    export default {
        data() {
            return {
                fullMount: null,
                discountMount: null,
                startDate: null,
                endDate: null,
                startTime: null,
                endTime: null,
                daysOfWeek: "",
                weeks: null,
                popupVisibleFail: false,
                popupVisibleSuccess: false,
                errorMsg: "",
                successMsg: ""
            }
        },
        methods: {
            cancel() {
                MessageBox.confirm('终止后该活动将立即失效，确定终止?', '').then(action => {
                    if (action === 'confirm') {
                        //调终止接口
                        Indicator.open({
                            spinnerType: 'fading-circle'
                        });
                        this.$http({
                            method: 'GET',
                            url: config.baseUrl+'/api/discountPayment/close/' + this.$route.params.id,
                        }).then((response) => {
                            Indicator.close();
                            if (response.data.code === '0' && response.data.eCode === '0') {
                                this.successMsg = "终止成功";
                                this.popupVisibleSuccess = true;
                                router.push({
                                    name: 'home'
                                })
                            } else if (window.navigator.onLine === true) {
                                this.errorMsg = response.data.msg;
                                this.popupVisibleFail = true;
                                return;
                            } else {
                                router.push({
                                    name: 'errorPage'
                                })
                            }
                        })
                    } else {
                        console.log(action);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            formatWeeks() {
                const weeks = [
                    {
                        "name": "1",
                        "value": "周日"
                    },
                    {
                        "name": "2",
                        "value": "周一"
                    },
                    {
                        "name": "3",
                        "value": "周二"
                    },
                    {
                        "name": "4",
                        "value": "周三"
                    },
                    {
                        "name": "5",
                        "value": "周四"
                    },
                    {
                        "name": "6",
                        "value": "周五"
                    },
                    {
                        "name": "7",
                        "value": "周六"
                    }
                ];
                if (this.weeks.length < 7) {
                    let i = 0;
                    for (i; i < weeks.length; i++) {
                        let j = 0;
                        for (j; j < this.weeks.length; j++) {
                            if (weeks[i].name === this.weeks[j]) {
                                this.daysOfWeek += weeks[i].value + " / "
                            }
                        }
                    }
                    this.daysOfWeek = this.daysOfWeek.substr(0, this.daysOfWeek.length - 2);
                } else {
                    this.daysOfWeek = "全部"
                }
            }
        },
        components: {
            public_header: public_header
        },
        mounted() {
            this.fullMount = this.$route.params.fullMount;
            this.discountMount = this.$route.params.discountMount;
            this.startDate = this.$route.params.startDate;
            this.endDate = this.$route.params.endDate;
            this.startTime = this.$route.params.startTime;
            this.endTime = this.$route.params.endTime;
            this.weeks = this.$route.params.daysOfWeek.split("#");
            this.formatWeeks();
        }
    }
</script>
<style scoped lang='less'>
    .coupon-detail {
        letter-spacing: 1px;
        article {
            label {
                position: absolute;
                margin: 0.3rem 0 0 0.3rem;
                font-size: 0.26rem;
                font-weight: bold;
                height: 0.37rem;
                line-height: 0.37rem;
                color: #424242;
            }
            p {
                position: absolute;
                margin: 0.87rem 0 0 0.3rem;
                font-size: 0.26rem;
                color: #909090;
            }
            .coupon-detail-content {
                width: 100%;
                height: 1.54rem;
                margin: 0.21rem 0 0 0;
                background: #FFFFFF;
            }
            .apply-period-content {
                width: 100%;
                height: 2.11rem;
                margin: 0.21rem 0 0 0;
                background: #FFFFFF;
                p:nth-child(3) {
                    margin: 1.44rem 0 0 0.3rem;
                }
            }
        }
        footer {
            .submitBtn {
                font-size: 0.3rem;
                color: #FFFFFF;
                text-align: center;
                background: rgba(255, 130, 0, 1);
                position: fixed;
                bottom: 0;
                height: 0.88rem;
                width: 100%;
                line-height: 0.88rem;
            }
        }
    }
</style>
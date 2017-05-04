<template>
    <div class="sub-nav" v-if="cashboxToken">
        <div class="nav-bar">
            <mt-navbar class='mt-nav-bar' fixed v-model="selected">
                <mt-tab-item id="full-reduction"><a>满减</a></mt-tab-item>
                <mt-tab-item id="vertical-fold"><a>立折</a></mt-tab-item>
            </mt-navbar>
        </div>
        <div id="full-reduction-content">
            <mt-loadmore v-if="showFullList" :top-method="loadTop" :bottom-method="loadBottom"
                         :bottom-all-loaded="allLoaded" :auto-fill="false" @bottom-status-change="handleBottomChange"
                         @top-status-change="handleTopChange" ref="loadmore">
                <ul class="page-loadmore-list">
                    <li v-for="(item, index) in full_data" key="item.index" class="page-loadmore-listitem"
                        @click='editCoupon(item, index)'
                        :class="{isUsing:(function(){return item.state=='2'?true:false})()}">
                        <div>
                            <p>
                                <span>满</span>&nbsp;<strong>{{item.value1 / 100}}</strong>&nbsp;<span>减</span>&nbsp;<strong>{{item.value2 / 100}}</strong>
                            </p>
                            <label>有效期: {{item.start_date}} 至 {{item.end_date}}</label>
                        </div>
                        <div>
                            <span>{{stateFilter(item.state)}}</span>
                            <img src="../static/images/ic_next.png"/>
                        </div>
                    </li>
                </ul>
                <div slot="top" class="mint-loadmore-top">
                    <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                    <span v-show="topStatus === 'loading'">
                    <mt-spinner color="#909090" type="fading-circle"></mt-spinner>
                </span>
                </div>
                <div slot="bottom" v-show="!allLoaded" class="mint-loadmore-bottom">
                    <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                    <span v-show="bottomStatus === 'loading'">
                    <mt-spinner color="#909090" type="fading-circle"></mt-spinner>
                </span>
                </div>
            </mt-loadmore>
            <div class='noFull-data noData' v-show="!showFullList&&selected=='full-reduction'&&!fecthingData">
                <div class="descImage"></div>
                <div class="descText">
                    <p>使用满减神器能够提升消费单笔客价单，</p>
                    <p>设置后通过好哒立牌自动优惠。</p>
                </div>
            </div>
        </div>
        <div id="vertical-fold-content">
            <mt-loadmore v-if="showFoldList" :top-method="loadTop" :bottom-method="loadBottom"
                         :bottom-all-loaded="allLoaded" :auto-fill="false" @bottom-status-change="handleBottomChange"
                         @top-status-change="handleTopChange" ref="loadmore">
                <ul class="page-loadmore-list">
                    <li v-for="(item, index) in fold_data" key="item.index" class="page-loadmore-listitem"
                        :class="{isUsing:(function(){return item.state=='2'?true:false})()}"
                        @click='editCoupon(item, index)'>
                        <div>
                            <p>
                                <strong>{{item.value1 / 10}}</strong>&nbsp;<span>折</span>
                            </p>
                            <label>有效期: {{item.start_date}} 至 {{item.end_date}}</label>
                        </div>
                        <div>
                            <span>{{stateFilter(item.state)}}</span>
                            <img src="../static/images/ic_next.png"/>
                        </div>
                    </li>
                </ul>
                <div slot="top" class="mint-loadmore-top">
                    <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                    <span v-show="topStatus === 'loading'">
                    <mt-spinner color="#909090" type="fading-circle"></mt-spinner>
                </span>
                </div>
                <div slot="bottom" v-show="!allLoaded" class="mint-loadmore-bottom">
                    <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                    <span v-show="bottomStatus === 'loading'">
                    <mt-spinner color="#909090" type="fading-circle"></mt-spinner>
                </span>
                </div>
            </mt-loadmore>
            <div class='noFold-data noData' v-show="!showFoldList&&selected=='vertical-fold'&&!fecthingData">
                <div class="descImage"></div>
                <div class="descText">
                    <p>人流量不够？立折神器帮你迅速提高客流量！</p>
                    <p>设置后通过好哒立牌自动优惠</p>
                </div>
            </div>
        </div>
        <mt-popup v-model="popupVisible3" position="top" class="mint-popup-3" :modal="false">{{errorMsg}}
        </mt-popup>
        <div class='creatBtn' @click="createFull()">创建</div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        Navbar,
        TabItem,
        Loadmore,
        Spinner,
        Indicator,
        Popup
    } from 'mint-ui';
    import config from '../common/js/config.js';
    Vue.component(Navbar.name, Navbar);
    Vue.component(TabItem.name, TabItem);
    Vue.component(Loadmore.name, Loadmore);
    Vue.component(Spinner.name, Spinner);
    Vue.component(Popup.name, Popup);
    export default {
        data() {
            return {
                full_data: [],
                fold_data: [],
                fecthingData: false,
                allLoaded: false,
                selected: "full-reduction",
                popupVisible3: false,
                bottomStatus: "",
                topStatus: "",
                value: 0,
                errorMsg: '',
                fullPage: 1,
                foldPage: 1,
                state: [{
                    code: '1',
                    value: '未开始'
                }, {
                    code: '2',
                    value: '进行中'
                }, {
                    code: '3',
                    value: '已终止'
                }, {
                    code: '4',
                    value: '已结束'
                }],
                cashboxToken: ""
            }
        },
        props: {
            getCashboxToken: {
                type: Function
            }
        },
        computed: {
            showFullList: function () {
                return this.full_data.length == 0 ? false : true
            },
            showFoldList: function () {
                return this.fold_data.length == 0 ? false : true
            }
        },
        watch: {
            selected(val) {
                if (val == "full-reduction") {
                    this.fullPage = 1;
                    this.fold_data = [];
                } else {
                    this.foldPage = 1;
                    this.full_data = [];
                }
                this.allLoaded = false;
                this.initCoupon();
            },
            popupVisible3(val) {
                if (val) {
                    setTimeout(() => {
                        this.popupVisible3 = false;
                    }, 2000);
                }
            },
            cashboxToken(val) {
                if (val) {
                    this.$emit('get-cashboxToken', val)
                }
            }
        },
        methods: {
            initCoupon() {
                this.fecthingData = true;
                Indicator.open({
                    spinnerType: 'fading-circle'
                });
                this.$http({
                    method: 'POST',
                    url: config.baseUrl + '/api/discountPayment/list',
                    data: {
                        type: this.selected === 'full-reduction' ? '1' : '2',
                        page: this.selected === 'full-reduction' ? this.fullPage : this.foldPage,
                        rows: 10
                    }
                }).then((response) => {
                    Indicator.close();
                    this.fecthingData = false;
                    if (response.data.code === '0' && response.data.eCode === '0') {
                        if (response.data.object.list.length > 0) {
                            if (response.data.object.list.length < 10) {
                                this.allLoaded = true;
                            } else {
                                this.allLoaded = false;
                            }
                            if (this.selected === 'full-reduction') {
                                if (this.fullPage === 1) {
                                    this.full_data = response.data.object.list;
                                } else {
                                    let i = 0
                                    for (i = 0; i < response.data.object.list.length; i++) {
                                        this.full_data.push(response.data.object.list[i])
                                    }
                                }
                                this.fullPage = this.fullPage + 1;
                                if (this.$refs.loadmore && (this.fullPage === 2)) {
                                    this.$refs.loadmore.onTopLoaded();
                                } else if (this.$refs.loadmore && (this.fullPage > 2)) {
                                    this.$refs.loadmore.onBottomLoaded();
                                }
                            } else {
                                if (this.foldPage === 1) {
                                    this.fold_data = response.data.object.list;
                                } else {
                                    let j = 0;
                                    for (j = 0; j < response.data.object.list.length; j++) {
                                        this.fold_data.push(response.data.object.list[j])
                                    }
                                }
                                this.foldPage = this.foldPage + 1;
                                if (this.$refs.loadmore && (this.foldPage === 2)) {
                                    this.$refs.loadmore.onTopLoaded();
                                } else if (this.$refs.loadmore && (this.foldPage > 2)) {
                                    this.$refs.loadmore.onBottomLoaded();
                                }
                            }
                        } else {
                            if (this.selected === 'full-reduction') {
                                this.full_data = [];
                                if (this.$refs.loadmore && (this.fullPage === 1)) {
                                    this.$refs.loadmore.onTopLoaded();
                                } else if (this.$refs.loadmore && (this.fullPage > 1)) {
                                    this.allLoaded = true;
                                    this.$refs.loadmore.onBottomLoaded();
                                }
                            } else {
                                this.fold_data = [];
                                if (this.$refs.loadmore && (this.foldPage === 1)) {
                                    this.$refs.loadmore.onTopLoaded();
                                } else if (this.$refs.loadmore && (this.foldPage > 1)) {
                                    this.allLoaded = true;
                                    this.$refs.loadmore.onBottomLoaded();
                                }
                            }
                        }
                    } else if (window.navigator.onLine === true) {
                        this.errorMsg = response.data.msg;
                        this.popupVisible3 = true;
                        return;
                    } else {
                        router.push({
                            name: 'errorPage'
                        })
                    }
                }).catch(function (response) {
                    Indicator.close();
                    router.push({
                        name: 'errorPage'
                    })
                });
            },
            handleTopChange(status) {
                this.topStatus = status;
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadTop() {
                if (this.selected === "full-reduction") {
                    this.fullPage = 1;
                } else {
                    this.foldPage = 1;
                }
                this.initCoupon();
            },
            loadBottom() {
                this.initCoupon();
            },
            stateFilter(value) {
                if (!value) return ''
                let val = '';
                let txt = '';
                let result = '';
                const list = this.state;
                for (let i = 0; i < list.length; i++) {
                    val = list[i].code;
                    txt = list[i].value;
                    if (val.toString() == value.toString()) {
                        result = txt;
                        break;
                    }
                }
                return result;
            },
            createFull() {
                router.push({
                    name: 'createCoupon',
                    params: {
                        type: this.selected === 'full-reduction' ? '1' : '2',
                        title: this.selected === 'full-reduction' ? '创建满减优惠' : '创建立折优惠'
                    }
                })
            },
            editCoupon(item, $index) {
                let pageList = document.getElementsByClassName("page-loadmore-listitem");
                pageList[$index].style.background = '#E5E5E5';
                // 进行中的活动，进入详情页面
                if (item.state === "2") {
                    setTimeout(() => {
                        router.push({
                            name: 'couponDetail',
                            params: {
                                type: this.selected === 'full-reduction' ? '1' : '2',
                                id: item.id,
                                title: this.selected === 'full-reduction' ? '满减优惠' : '立折优惠',
                                fullMount: this.selected === 'full-reduction' ? item.value1 / 100 : item.value1 / 10,
                                discountMount: this.selected === 'full-reduction' ? item.value2 / 100 : 0,
                                startTime: item.start_time,
                                endTime: item.end_time,
                                startDate: item.start_date,
                                endDate: item.end_date,
                                daysOfWeek: item.daysOfWeek
                            }
                        })
                    }, 100)
                } else {
                    // 进入编辑页面
                    setTimeout(() => {
                        router.push({
                            name: 'editCoupon',
                            params: {
                                type: this.selected === 'full-reduction' ? '1' : '2',
                                id: item.id,
                                title: this.selected === 'full-reduction' ? '编辑满减优惠' : '编辑立折优惠',
                                status: item.state,
                                fullMount: this.selected === 'full-reduction' ? item.value1 / 100 : item.value1 / 10,
                                discountMount: this.selected === 'full-reduction' ? item.value2 / 100 : 0,
                                startTime: item.start_time,
                                endTime: item.end_time,
                                startDate: item.start_date,
                                endDate: item.end_date,
                                produceData: item.produce_data,
                                daysOfWeek: item.daysOfWeek
                            }
                        })
                    }, 100)
                }
            },
            initCashbox() {
                // 通过url有没有token来判断钱盒是3.5.6之前的版本还是3.5.6之后的版本
                this.cashboxToken = this.Util.Request().token;
                if (this.cashboxToken) {
                    this.initPage();
                } else {
                    this.Util.Storage.set("FLAG", "newWebview");
                    this.Util.Cashbox.callNative('getToken', {}, (res) => {
                        if (JSON.stringify(res) !== "{}") {
                            this.cashboxToken = res.data.tpfToken;
                            this.initPage();
                        } else {
                            window.location.href = '/mchtH5Web/#/errorPage';
                        }
                    })
                }
            },
            initPage() {
                // 钱盒TOKEN
                if (this.cashboxToken) {
                    this.Util.Storage.set('TOKEN', this.cashboxToken);
                } else {
                    window.location.href = '/mchtH5Web/#/errorPage';
                }
            }
        },
        activated() {
            // 从别的组件切换回来，初始化数据
            this.fullPage = 1;
            this.foldPage = 1;
            this.initCoupon();
            let pageList = document.getElementsByClassName("page-loadmore-listitem");
            let i = 0;
            for (i; i < pageList.length; i++) {
                pageList[i].style.background = '#FFFFFF';
            }
        },
        mounted() {
            // 挂在之前获取token
            this.initCashbox();
        }
    }
</script>
<style lang='less'>
    .sub-nav {
        .nav-bar {
            height: .8rem;
            line-height: .8rem;
        }
        .page-loadmore-list {
            li:nth-child(1) {
                margin: 0.2rem 0 0 0;
            }
            li.isUsing {
                div:first-child {
                    p {
                        color: #424242;
                    }
                    label {
                        color: #909090;
                    }
                }
                div:last-child span {
                    color: #424242;
                }
            }
            .page-loadmore-listitem {
                height: 1.51rem;
                width: 100%;
                letter-spacing: 1px;
                background: #FFFFFF;
                font-size: 0.26rem;
                border-bottom: 1px solid #E0E0E0;
                p {
                    height: 0.56rem;
                    line-height: 0.56rem;
                    margin: 0.24rem 0 0.09rem 0.3rem;
                    color: #BDBDBD;
                    vertical-align: middle;
                    span {
                        display: inline-block;
                        line-height: 0.56rem;
                        vertical-align: middle;
                    }
                    strong {
                        font-size: 0.38rem;
                        line-height: 0.56rem;
                        vertical-align: middle;
                    }
                }
                label {
                    color: #BDBDBD;
                    margin: 0.87rem 0 0.25rem 0.3rem;
                }
                div {
                    display: inline-block;
                }
                div:nth-child(2) {
                    float: right;
                    margin: 0 0.3rem 0 0;
                    span {
                        color: #BDBDBD;
                        line-height: 1.51rem;
                        vertical-align: middle;
                    }
                    img {
                        width: 0.28rem;
                        height: 0.28rem;
                        vertical-align: middle;
                    }
                }
            }
        }

        .mint-loadmore-bottom,
        .mint-loadmore-top {
            span {
                font-size: 0.3rem;
                display: inline-block;
                transition: .2s linear;
                vertical-align: middle;
            }
            span.is-rotate {
                transform: rotate(180deg);
            }
        }

        .noData {
            text-align: center;
            height: 9.2rem;
            .descImage {
                width: 2.4rem;
                height: 2.4rem;
                background: url('../static/images/pic_tips.png') no-repeat 0 0;
                background-size: 2.4rem 2.4rem;
                margin: 13.5% auto auto auto;
            }
            .descText {
                margin: .1rem auto auto auto;
                p {
                    font-size: .28rem;
                    color: #424242;
                    letter-spacing: 1px;
                    line-height: .42rem;
                }
            }
        }

        .creatBtn {
            font-size: .3rem;
            color: #FFFFFF;
            letter-spacing: 1px;
            text-align: center;
            background: rgba(255, 130, 0, 1);
            position: fixed;
            bottom: 0;
            height: .88rem;
            width: 100%;
            line-height: .88rem;
        }
    }

    /* errorPopup style */

    .mint-popup-3 {
        width: 100%;
        height: .8rem;
        background: rgba(254, 56, 36, 1);
        letter-spacing: .006rem;
        font-size: .26rem;
        color: #fff;
        text-align: center;
        line-height: .8rem;
    }

    .mint-loadmore {
        overflow: inherit;
    }

    .mint-navbar.is-fixed {
        height: 0.8rem;
        top: .88rem;
    }

    .mint-navbar .mint-tab-item {
        font-size: 0.28rem;
        color: #424242;
        letter-spacing: 1.08px;
        padding: 0;
    }

    .mint-tab-item {
        padding: 0;
    }

    .mint-tab-item-label {
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.28rem;
    }

    .mint-navbar .mint-tab-item.is-selected {
        border-bottom: 3px solid rgba(255, 130, 0, 1) !important;
        color: #FF8200 !important;
        margin-bottom: 0;
    }

    .mint-loadmore-text {
        font-size: 0.3rem;
    }

    .mint-indicator {
        font-size: .05rem;
    }

</style>

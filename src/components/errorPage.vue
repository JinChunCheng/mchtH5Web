<template>
    <div class="index">
        <public_header title=''></public_header>
        <div class='noWifi'>
            <div class="noWifiImg"></div>
            <div class="noWifiDesc">
                <p>网络异常</p>
            </div>
            <div @click='reload' class="reload">
                重新加载
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import public_header from './public_header.vue'

    export default {
        components: {
            public_header: public_header
        },
        methods: {
            reload() {
                this.$children[0].goBack()
            }
        },

    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
    .index {
        .noWifi {
            text-align: center;
            height: 9.2rem;
            .noWifiImg {
                width: 2.4rem;
                height: 2.4rem;
                background: url('../static/images/tips_nowifi.png') no-repeat 0 0;
                background-size: 2.4rem 2.4rem;
                margin: 19.5% auto auto auto;
            }
            .noWifiDesc {
                margin: .2rem auto auto auto;
                p {
                    font-family: PingFangSC-Light;
                    font-size: .3rem;
                    color: #424242;
                    letter-spacing: 1px;
                    line-height: .44rem;
                }
            }
        }
        .reload {
            margin: 4.34rem auto auto auto;
            width: 2rem;
            height: .68rem;
            border: .02rem solid #FFC07F;
            border-radius: .06rem;
            font-family: PingFangSC-Regular;
            font-size: .3rem;
            color: #FFC07F;
            letter-spacing: .01rem;
            line-height: .68rem;
        }
    }
</style>

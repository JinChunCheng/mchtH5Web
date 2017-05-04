<template>
    <div class='public_header'>
        <header class="header" :backCashBox='backCashBox'>
            <div class="header-inner">
                <button class="icon-back" @touchstart='changeStyle($event)' @touchend='removeStyle($event)'></button>
                <h1 class="text-center">{{title}}</h1>
            </div>
        </header>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        Header,
        Toast
    } from 'mint-ui';
    Vue.component(Header.name, Header);
    export default {
        props: ['title', 'backCashBox'],
        methods: {
            goBack() {
                if (this.backCashBox) {
                    this.Util.Cashbox.exit();
                    return;
                }
                if (window.navigator.onLine === false) {
                    if (this.$route.name === 'errorPage') {
                        Toast({
                            message: '网络连接错误！',
                            position: 'middle'
                        });
                        return;
                    }
                    router.push({
                        name: 'errorPage'
                    })
                } else {
                    router.go(-1)
                }
            },
            changeStyle(e) {
                e.target.style.opacity = "0.5";
            },
            removeStyle(e) {
                e.target.style.opacity = "1";
                this.goBack();
            }
        }
    }
</script>
<style scoped lang="less">
    .header {
        height: 0.88rem;
        width: 100%;
        .header-inner {
            height: 0.88rem;
            line-height: 0.88rem;
            position: fixed;
            top: 0;
            z-index: 999;
            width: 100%;
            background: rgba(255, 255, 255, 1);
            border-bottom: 1px solid #E0E0E0;
            .text-center {
                text-align: center;
            }
            h1 {
                font-size: 0.34rem;
                color: #424242;
            }
            .icon-back {
                border: none;
                outline: none;
                width: 1.08rem;
                height: 0.88rem;
                display: inline-block;
                position: absolute;
                background: url("../static/images/ic_back.png") no-repeat center;
                background-size: 0.48rem 0.48rem;
            }
        }
        a {
            color: inherit;
        }
    }

    .mt-progress {
        position: fixed;
        height: .01rem;
        width: 100%;
        z-index: 1000;
    }

    .mt-progress-progress {
        background-color: #FE880C;
    }

</style>

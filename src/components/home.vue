<template>
    <div class="home">
        <public_header title='优惠买单' backCashBox='true' v-if="cashboxToken"></public_header>
        <sub_nav @get-cashboxToken="getCashboxToken"></sub_nav>
    </div>
</template>
<script>
    import Vue from 'vue';
    import public_header from './public_header.vue'
    import sub_nav from './sub_nav.vue';
    export default {
        data() {
            return {
                cashboxToken: ""
            }
        },
        components: {
            sub_nav: sub_nav,
            public_header: public_header
        },
        methods: {
            getCashboxToken(val) {
                this.cashboxToken = val;
            }
        },
        created() {
            this.Util.Cashbox.init();
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

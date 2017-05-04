<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <!-- 这里不会被keepalive -->
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        }
    }
</script>
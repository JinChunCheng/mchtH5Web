<template>
    <div class='week_div'>
        <div class='week border_bottom'>
            <p v-bind:class="{ selected: allDay }" data-id='all' @click='controlDay($event)'>全部</p>
            <p v-bind:class="{ selected: day2 }" data-id='2' @click='controlDay($event)'>周一</p>
            <p v-bind:class="{ selected: day3 }" data-id='3' @click='controlDay($event)'>周二</p>
            <p v-bind:class="{ selected: day4 }" data-id='4' @click='controlDay($event)'>周三</p>
        </div>
        <div class='week'>
            <p v-bind:class="{ selected: day5 }" data-id='5' @click='controlDay($event)'>周四</p>
            <p v-bind:class="{ selected: day6 }" data-id='6' @click='controlDay($event)'>周五</p>
            <p v-bind:class="{ selected: day7 }" data-id='7' @click='controlDay($event)'>周六</p>
            <p v-bind:class="{ selected: day1 }" data-id='1' @click='controlDay($event)'>周日</p>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            days: {
                type: String
            }
        },
        data() {
            return {
                day1: false,
                day2: false,
                day3: false,
                day4: false,
                day5: false,
                day6: false,
                day7: false,
                allDay: true,
                daysOfWeek: [],
                allDays: [1, 2, 3, 4, 5, 6, 7]
            }
        },
        watch: {
            days(val) {
                this.initData()
            }
        },
        methods: {
            initData() {
                if (this.days) {
                    this.daysOfWeek = this.days.split("#");
                    if (this.daysOfWeek.sort().toString() === this.allDays.sort().toString()) {
                        this.allDay = true;
                    } else {
                        this.allDay = false;
                        this.daysOfWeek.forEach(item => {
                            if (item === "1") {
                                this.day1 = "1";
                            }
                            if (item === "2") {
                                this.day2 = "2";
                            }
                            if (item === "3") {
                                this.day3 = "3";
                            }
                            if (item === "4") {
                                this.day4 = "4";
                            }
                            if (item === "5") {
                                this.day5 = "5";
                            }
                            if (item === "6") {
                                this.day6 = "6";
                            }
                            if (item === "7") {
                                this.day7 = "7";
                            }
                        })
                    }
                }
            },
            controlDay($event) {
                let currentID = $event.currentTarget.getAttribute('data-id');
                if (currentID === 'all') {
                    this.allDay = true;
                    this.day1 = this.day2 = this.day3 = this.day4 = this.day5 = this.day6 = this.day7 = false;
                } else {
                    let currentDay = "day" + currentID;
                    this[currentDay] = this[currentDay] === false ? currentID : false;
                    this.allDay = false;
                }
                if (this.day1 === "1" && this.day2 === "2" && this.day3 === "3" && this.day4 === "4" && this.day5 === "5" && this.day6 === "6" && this.day7 === "7") {
                    this.allDay = true;
                    this.day1 = this.day2 = this.day3 = this.day4 = this.day5 = this.day6 = this.day7 = false;
                }
            }
        },
        mounted() {
            this.initData()
        }
    }
</script>
<style scoped>
    .week_div {
        background: #fff;
    }

    .week {
        height: 1.12rem;
        line-height: 1.12rem;
    }

    .week p {
        font-size: .2rem;
        float: left;
        width: 20%;
        height: .72rem;
        line-height: .72rem;
        margin-left: 4%;
        text-align: center;
        background-color: #F7F7F7;
        border-radius: .06rem;
        margin-top: 2.7%;
        font-family: PingFangSC-Regular;
        font-size: .26rem;
        color: #424242;
        letter-spacing: 0.87px;
    }

    .border_bottom {
        border-top: 1px solid #F3F3F3;
    }

    .selected {
        font-family: PingFangSC-Medium !important;
        color: #FF804F !important;
        background-color: #FFF2DE !important;
    }
</style>

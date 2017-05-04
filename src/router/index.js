import home from '../components/home.vue'
import createCoupon from '../components/createCoupon.vue'
import editCoupon from '../components/editCoupon.vue'
import couponDetail from '../components/couponDetail.vue'
import errorPage from '../components/errorPage.vue'

export default [{
    path: '/',
    name: 'home',
    component: home,
    meta: {keepAlive: true} // 这个是需要keepalive的
}, {
    path: '/createCoupon/:type/:title',
    name: 'createCoupon',
    component: createCoupon
}, {
    path: '/editCoupon/:type/:id/:title/:status/:fullMount/:discountMount/:startTime/:endTime/:startDate/:endDate/:produceData/:daysOfWeek',
    name: 'editCoupon',
    component: editCoupon
}, {
    path: '/couponDetail/:type/:id/:title/:fullMount/:discountMount/:startTime/:endTime/:startDate/:endDate/:daysOfWeek',
    name: 'couponDetail',
    component: couponDetail
}, {
    path: '/errorPage',
    name: 'errorPage',
    component: errorPage
}]

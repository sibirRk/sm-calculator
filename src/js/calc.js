import Vue from 'vue';
import VueSlider from 'vue-slider-component';

Vue.component('VueSlider', VueSlider);

const app = new Vue({
  el: '#calculator-app',
  data: {
    price: 1250000,
    firstPay: 0,
    mortgagePercent: 8,
    creditPeriod: 12,
    annuitet: 24000,
    marks: [0, 6, 12, 18, 24]
  },
});


// https://nightcatsama.github.io/vue-slider-component/#/basics/simple

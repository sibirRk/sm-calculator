import Vue from 'vue';
import VueSlider from 'vue-slider-component';
import VModal from 'vue-js-modal';
import sklonyator from "../plugins/sklonyator";

Vue.component('VueSlider', VueSlider);
Vue.use(VModal);
Vue.use(sklonyator);

const app = new Vue({
  el: '#calculator-app',
  data: {
    spoilerOpened: false,
    spoilerOpenedObj: false,
    fittedFlats: 5,
    fitObjects: [],
    accredJKSelected: null,
    accredObjectSelected: null,
    price: 4500000,
    minFirstPay: 450000,
    maxFirstPay: 450000,
    firstPay: 1500000,
    mortgagePercent: 9,
    creditPeriod: 25,
    marks: [1, 6, 12, 18, 25, 30],
    bankModal: Object.keys(window.is_calcBanks)[0],
    showAccredInfo: false
  },
  computed: {
    objects: function() {
      return window.is_calcObjects;
    },
    banks: function() {
      return window.is_calcBanks;
    },
    banksOrdered: function () {
        return window.is_calcBanksOrder;
    },
    accredBanks: function() {
      if (this.accredJKSelected !== null && this.accredObjectSelected !== null) {
        return this.objects[this.accredJKSelected].accredited[this.accredObjectSelected].banks;
      } else {
        return []
      }
    },
    ourProjectsLocal: function() {
      if (this.fitObjects.length === 11 ) {
        return 'наших проектах';
      } else if (this.fitObjects.length % 10 === 1) {
        return 'нашем проекте';
      } else {
        return 'наших проектах';
      }
    },
    creditPeriodRu: function() {
      if (this.creditPeriod === 1 || this.creditPeriod === 21) {
        return 'год';
      } else if (this.creditPeriod >= 10 && this.creditPeriod <= 20) {
        return 'лет';
      } else if (this.creditPeriod % 10 >= 2 && this.creditPeriod % 10 <= 4) {
        return 'года';
      } else {
        return 'лет';
      }
    },
    annuitet: function() {
      let flatPrice = this.price,
          firstPay = this.firstPay,
          percent = this.mortgagePercent,
          period = this.creditPeriod;

      let creditSum = flatPrice - firstPay,
          percentPerMonth = percent / 12 / 100,
          monthsAmount = 12 * period;

      let payPerMonth = percentPerMonth * Math.pow(1 + percentPerMonth, monthsAmount)
          /
          (Math.pow(1 + percentPerMonth, monthsAmount) - 1) * creditSum;

      if (payPerMonth < 0) {
        return 0
      } else {
        return Math.floor(payPerMonth) + 1
      }

    }
  },
  mounted: function () {
      this.calcFlats();
  },
  watch: {
    price: function() {
        this.calcFlats();
    }
  },
  methods: {
    resetAccredObj() {
      this.accredObjectSelected = null
    },
    showModal(dataId) {
      this.bankModal = dataId / 1;
      this.$modal.show('bank-contacts');
    },
    updatePrice(e) {
      let val = e.target.value;
      this.price = val.replace(/[\s, ₽]/g, '') / 1;
      e.target.value = this.price + ' ₽'
    },
    updateFirstPay(e) {
      let val = e.target.value;
      this.firstPay = val.replace(/[\s,₽]/g, '') / 1;
      e.target.value = this.firstPay + ' ₽'
    },
    updatePercents(e) {
      let val = e.target.value;
      this.mortgagePercent = val.replace('%', '') / 1;
      e.target.value = this.mortgagePercent + '%'
    },
    updatePeriod(e) {
      let val = e.target.value;
      this.creditPeriod = val.replace(/[а-я, \s]/g, '') / 1;
      e.target.value = this.creditPeriod + ' ' + this.creditPeriodRu
    },
    clearRub(e) {
      e.target.value = e.target.value.replace(/[₽, \s]/g, '');
    },
    clearPeriodRu(e) {
      e.target.value = e.target.value.replace(/[а-я, \s]/g, '') / 1;
    },
    clearPercent(e) {
      e.target.value = e.target.value.replace(/[%,\s]/g, '') / 1;
    },
    calcFlats() {
      let objectsArray = [];
      for (let key in this.objects) {
          let elem = this.objects[key];
          let flats = 0;
          let curPrice = this.price;
          for (let flat of elem.flats) {
              if (curPrice > parseFloat(flat.price)) {
                  flats++;
              }
          }
          if (flats > 0) {
              objectsArray.push({
                  id: elem.id,
                  title: elem.title,
                  flats: flats,
                  bg: `background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.31) 0%, rgba(0, 0, 0, 0) 100%), url('${elem.img}')`,
                  link: elem.link + '/filter/price-розница-from-0-to-' + curPrice + '/apply/?sort=price&by=asc'
              })
          }
      }
      if (objectsArray.length) {
          this.fitObjects = objectsArray;
      }
      this.maxFirstPay = this.price;
      this.minFirstPay = Math.ceil(this.price * 0.1);
      if (this.firstPay < this.minFirstPay) {
          this.firstPay = this.minFirstPay;
      }
    }
  }
});

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
// https://nightcatsama.github.io/vue-slider-component/#/basics/simple

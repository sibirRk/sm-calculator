import Vue from 'vue';
import VueSlider from 'vue-slider-component';
import VModal from 'vue-js-modal';
import sklonyator from "../plugins/sklonyator";

Vue.component('VueSlider', VueSlider);
Vue.use(VModal);
Vue.use(sklonyator);
window.is_initValues = {
    price_min: window.is_calcPriceFrom || 1690000,
    price_max: window.is_calcPrice || 4500000,
    rate: window.is_calcRate || 9,
    creditPeriod: window.is_calcYears || 25,
    firstPay: window.is_calcFirstPay || 1500000,
    accredJKSelected: window.is_calcObjectProjectSelected || null,
    accredObjectSelected: window.is_calcObjectSelected || null,
};

const app = new Vue({
  el: '#calculator-app',
  data: {
    spoilerOpened: false,
    spoilerOpenedObj: false,
    fittedFlats: 5,
    fitObjects: [],
    accredJKSelected: window.is_initValues.accredJKSelected,
    accredObjectSelected: window.is_initValues.accredObjectSelected,
    price: window.is_initValues.price_max,
    minFirstPay: 450000,
    maxFirstPay: 450000,
    firstPay: window.is_initValues.firstPay,
    mortgagePercent: window.is_initValues.rate,
    creditPeriod: window.is_initValues.creditPeriod,
    marks: [1, 6, 12, 18, 25, 30],
    bankModal: Object.keys(window.is_calcBanks)[0],
    showAccredInfo: window.is_calcObjectSelected != null,
    hideObjectSelect: false,
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
      let banks = [];
      this.hideObjectSelect = false;
      if(this.accredJKSelected !== null
          && typeof this.objects[this.accredJKSelected] !== "undefined"
          && typeof this.objects[this.accredJKSelected].banks !== "undefined"
      ) {
          banks = this.objects[this.accredJKSelected].banks;
          this.hideObjectSelect = true;
      }
      else if (this.accredJKSelected !== null && this.accredObjectSelected !== null
          && typeof this.objects[this.accredJKSelected] !== "undefined"
          && typeof this.objects[this.accredJKSelected].accredited[this.accredObjectSelected] !== "undefined"
      ) {
          banks = this.objects[this.accredJKSelected].accredited[this.accredObjectSelected].banks;
      }
      return banks;
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
        this.price = val.replace(/[\s,₽]/g, '') / 1;
        e.target.value = this.price + ' ₽';
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
              let flatprice = parseFloat(flat.price);
              if (curPrice >= flatprice ) {
                  flats++;
              }
          }
          if (flats > 0) {
              objectsArray.push({
                  id: elem.id,
                  title: elem.title,
                  flats: flats,
                  bg: `background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.31) 0%, rgba(0, 0, 0, 0) 100%), url('${elem.img}')`,
                  link: elem.link + '/filter/price-розница-to-' + curPrice + '/apply/?sort=price&by=asc'
              })
          }
      }
      if (objectsArray.length) {
          let compare = function (a, b) {
              if (a.flats < b.flats)
                  return 1;
              if (a.flats > b.flats)
                  return -1;
              return 0;
          };
          this.fitObjects = objectsArray.sort(compare);
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

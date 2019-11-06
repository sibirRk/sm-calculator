import Vue from 'vue';
import VueSlider from 'vue-slider-component';

Vue.component('VueSlider', VueSlider);

const app = new Vue({
  el: '#calculator-app',
  data: {
    spoilerOpened: false,
    fittedFlats: 5,
    fitObjects: [],
    price: 2550000,
    firstPay: 0,
    mortgagePercent: 8,
    creditPeriod: 12,
    annuitet: 24000,
    marks: [0, 6, 12, 18, 24],
  },
  computed: {
    objects: function() {
      return window.smObjects;
    },
    ourProjectsLocal: function() {
      if (this.fitObjects.length === 11 ) {
        return 'наших проектах';
      } else if (this.fitObjects.length % 10 === 1) {
        return 'нашем проекте';
      } else {
        return 'наших проектах';
      }
    }
  },
  watch: {
    price: function() {
      let objectsArray = [];
      for (let elem of this.objects) {
        let flats = 0;
        for (let flat of elem.flats) {
          if (this.price > flat.price) {
            flats++;
          }
        }
        if (flats > 0) {
          objectsArray.push({
            id: elem.id,
            title: elem.title,
            flats: flats,
            bg: `background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.31) 0%, rgba(0, 0, 0, 0) 100%), url('${elem.img}')`,
            link: elem.link
          })
        }
      }
      if (objectsArray.length) {
        this.fitObjects = objectsArray;
      }
    }
  }
});


// https://nightcatsama.github.io/vue-slider-component/#/basics/simple

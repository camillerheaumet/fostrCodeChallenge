var route1 = require('./json/banana-oatmeal-cookie.json');
var route2 = require('./json/basil-and-pesto-hummus.json');
var route3 = require('./json/black-bean-and-rice-enchiladas.json');
var route4 = require('./json/divine-hard-boiled-eggs.json');
var route5 = require('./json/four-cheese-margherita-pizza.json');
var route6 = require('./json/homemade-black-bean-veggie-burgers.json');
var route7 = require('./json/homemade-chicken-enchiladas.json');
var route8 = require('./json/marinated-grilled-shrimp.json');
var route9 = require('./json/vegetable-fried-rice.json');
var route10 = require('./json/vegetarian-korma.json');

module.exports = function() {
  return {
    "recipes": {
      "banana-oatmeal-cookie" : route1,
      "basil-and-pesto-hummus" : route2,
      "black-bean-and-rice-enchiladas" : route3,
      "divine-hard-boiled-eggs" : route4,
      "four-cheese-margherita-pizza" : route5,
      "homemade-black-bean-veggie-burgers" : route6,
      "homemade-chicken-enchiladas" : route7,
      "marinated-grilled-shrimp" : route8,
      "vegetable-fried-rice" : route9,
      "vegetarian-korma" : route10
    }
  }
}
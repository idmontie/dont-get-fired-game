/**
 * A Factory that makes consumers
 */
var count = 0;
var Consumer = function( name, regProduct, incomePerItem, wastePerItem, baseBuyRate )
{
  count++;
  this.name = name;
  this.regProduct = regProduct;
  this.incomePerItem = incomePerItem ;
  this.wastePerItem = wastePerItem ;
  this.baseBuyRate = baseBuyRate ;
  this.id = 'Consumer' + count;
};
module.exports = ConsumerFactory;

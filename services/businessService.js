
var moment = require('moment'),
  	  _ = require('underscore');


/*
* Get intersection of the business at the moment to find similar business
* @author Ivan Gonzalez <ivan@rokk3rlabs.com>
* @param {array} firstArray - business array
* @param {array} secondArray - business array
* @param {string} businessId - business id to compare
* @return {array} result - array with business objects
*/

exports.getIntersectionBusinessForSimilarBusiness = function(firstArray, secondArray, businessId) {

  console.log("\r\n Inside getIntersectionBusiness ")

  var result = [];

  _.each(firstArray, function(firstValue){

      _.each(secondArray, function(secondValue){

         if( _.isEqual(firstValue._id, secondValue._id) && firstValue._id != businessId ){

            result.push(firstValue)
         }

      });
  })

  return result;
};
  /**
 * Get new slug url structure
 * @author Ivan Gonzalez <ivan@rokk3rlabs.com>
 * @param {object} businessData - business object
 * @return {string} seoUrl - new slug url 
 */
exports.getNewStructureUrl = function(businessData){

	var businessName = businessData.name.trim(),
		businessCity = businessData.city.trim(),
		businessState = businessData.filters.stateString.trim();

  businessName = businessName.replace(/[,';.’]/g,"");
  businessName = businessName.replace(/&/g,"-and-");
  businessName = businessName.replace(/\//g,"-");


	businessName = businessName.replace(/\s/g, "-");
	businessCity = businessCity.replace(/\s/g, "-");
	businessState = businessState.replace(/\s/g, "-");

	var seoUrl = businessName+"-"+businessCity+"-"+businessState;
	seoUrl = seoUrl.toLowerCase();

	return seoUrl;

}
/**
 * Get slug url
 * @author Ivan Gonzalez <ivan@rokk3rlabs.com>
 * @param {object} businessData - business object
 * @param {boolean} addHostUrl - flag to add host url 
 * @return {string} slug - slug url
 */
exports.getSlugUrl = function(businessData, addHostUrl){

  var slug = "";

  if(addHostUrl){

    slug = sails.config.appConfig.hostUrl + "/";

  }

  slug += (businessData.seo_slug_url) ? businessData.seo_slug_url : businessData.slug;

  return slug;

}
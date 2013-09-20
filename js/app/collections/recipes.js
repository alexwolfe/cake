(function(){
	'use strict';

	/* globals Backbone, Cake */

	Cake.Collections.Recipes = Backbone.Firebase.Collection.extend({
		url: '/recipes',
		model: Cake.Models.Recipe,
		firebase: new Firebase("https://wolfe.firebaseio.com/recipes"),

		search: function(term) {
			var models = this.filter(function(model) {

				var labels = model.get('labels');
				var filterLabels = _.where(labels, {name: term});

				return filterLabels.length;
			});

			return models;
		}
	});
})();
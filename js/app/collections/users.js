(function(){
	'use strict';

	/* globals Backbone, Cake */

	Cake.Collections.Users = Backbone.Firebase.Collection.extend({
		url: '/users',
		model: Cake.Models.User,
		firebase: new Firebase("https://wolfe.firebaseio.com/users")
	});
})();
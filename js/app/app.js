(function(){
    'use strict';

    /* globals Backbone, Cake */


	Cake.Views.Controller =  Backbone.View.extend({
		firebase: null,
		collections: {},
		models: {},
		router: null,
		currentPage: 'home',
		currentSearch: '',
		el: $('#app'),

		events: {
			'click #login': 'authorizeUser',
			'click #add-recipe': 'addRecipe'
		},


		initialize: function() {
			//CREATE A FIREBASE REFERENCE
			this.firebase = new Firebase('https://wolfe.firebaseio.com/');

			//CREATE MODELS
			this.models.user = new Cake.Models.User();

			//CREATE COLLECTIONS
			this.collections.recipes = new Cake.Collections.Recipes();
			this.collections.users = new Cake.Collections.Users();


			//ADD EVENTS
			this.on('home', this.createAllRecipes, this);
			this.on('recipes', this.createMyRecipes, this);
			this.on('favorites', this.createMyFavorites, this);
			this.on('search', this.searchRecipes, this);
			this.listenTo(this.collections.recipes, 'all', this.updateStage);

			this.authorizeUser();
		},

		render: function() {
			this.createNav();
			this.createAllRecipes();

			return this;
		},

		createNav: function() {
			var nav = new Cake.Views.Nav({
				model: this.models.user,
				router: this.router
			});
		},

		updateStage: function() {
			var username = this.models.user.get('username');

			switch(this.currentPage) {
				case 'home': this.createAllRecipes(); break;
				case 'recipes': this.createMyRecipes(username); break;
				case 'favorites': this.createMyFavorites(username); break;
				case 'search': this.searchRecipes(this.currentSearch); break;
				default: this.createAllRecipes(); break;
			}

		},

		createAllRecipes: function() {
			var stage = this.$('#stage');
			stage.html('');

			_.each(this.collections.recipes.models, function(model) {
				var recipe = new Cake.Views.Recipe({
					model: model,
					collection: this.collections.recipes,
					user: this.models.user
				});

				stage.append(recipe.el);
			}.bind(this));
		},

		createMyRecipes: function(username) {
			var myRecipes = this.collections.recipes.where({ownerid: this.models.user.id});

			var stage = this.$('#stage');
			stage.html('<h1 class="main-title"> Recipes created by ' + username + '</h1>');

			_.each(myRecipes, function(model) {
				var recipe = new Cake.Views.Recipe({
					model: model,
					collection: this.collections.recipes,
					user: this.models.user
				});
				stage.append(recipe.el);
			}.bind(this));
		},

		createMyFavorites: function(username) {
			var myRecipes = this.collections.recipes.where({ownerid: this.models.user.id});
			var stage = this.$('#stage');
			stage.html('<h1 class="main-title">' + username + ' Favorites</h1>');

			_.each(myRecipes, function(model) {
				var recipe = new Cake.Views.Recipe({
					model: model,
					collection: this.collections.recipes,
					user: this.models.user
				});
				stage.append(recipe.el);
			}.bind(this));
		},

		searchRecipes: function(term) {
			var recipes = this.collections.recipes.search(term);

			var stage = this.$('#stage');
			stage.html('<h1 class="main-title"> Results for ' + term + '</h1>');

			_.each(recipes, function(model) {
				var recipe = new Cake.Views.Recipe({
					model: model,
					collection: this.collections.recipes,
					user: this.models.user
				});

				stage.append(recipe.el);
			}.bind(this));
		},

		authorizeUser: function() {
			//USE SIMPLE AUTH
			this.auth = new FirebaseSimpleLogin(this.firebase, function(error, user) {

				if(user) {
					//SEED MODEL WITH USER DATA
					this.models.user.set(user);

					//IF SUCCESSFUL ADD USER TO COLLECTION
					this.collections.users.add(this.models.user);
				}
				else if(error) {
					//ERROR OCCURED
				}
				else {
					//LOGGED OUT
				}
			}.bind(this));

		},

		login: function(e) {
			e.preventDefault();
			this.auth.login('facebook');
		},

		addRecipe: function(e) {
			e.preventDefault();
			var accessToken = this.models.user.get('accessToken');

			//MAKE SURE THE USER IS AUTHENTICATED FIRST
			if(accessToken) {
				var form = new Cake.Views.RecipeForm({
					collection: this.collections.recipes,
					user: this.models.user
				});

				$(document.body).append(form.el);
				form.render();
			}
		}
	});
})();
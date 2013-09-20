(function(){
  'use strict';

  /* globals Backbone, Cake */

    Cake.Router = Backbone.Router.extend({

        routes: {
          "home": 'home',
          'recipes/:username': 'recipes',
          'favorites/:username': 'favorites',
          'search/:term': 'search'
        },

        initialize: function(controller) {
            _.bindAll(this, 'home');

            this.controller = controller;
            this.controller.router = this;
            this.controller.render();
        },

        home: function() {
            this.setPage('home');
            this.controller.trigger('home');
        },

        recipes: function(username) {
            this.setPage('recipes');
            this.controller.trigger('recipes', username);
        },

        favorites: function(username) {
            this.setPage('recipes');
            this.controller.trigger('search', username);
        },

        search: function(term) {
            this.setPage('search');
            this.controller.trigger('search', term);
            this.controller.currentSearch = term;
        },

        setPage: function(page) {
            this.controller.currentPage = page;
        }
    });
})();
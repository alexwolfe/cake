(function(){
    'use strict';

    /* globals Backbone, Cake, Mustache */

    Cake.Views.Nav = Backbone.View.extend({
        el: $('#main-nav'),
        template: $('#template_nav_logged_in').html(),
        templateLoggedOut: $('#template_nav_logged_out').html(),

        events: {
            'click h1': 'navigateHome',
            'click .my-recipes': 'navigateMyRecipes',
            'click .favorites': 'navigateMyFavorites',
            'click .profile': 'showProfile',
            'keypress #search': "searchRecipes"
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {

            var data = this.model.toJSON();
            var template =  Mustache.to_html(this.template, data);

            this.$('.controls').html(template);

            return this;
        },

        navigateHome: function(e) {
            e.preventDefault();

            //CLEAR SEARCH BOX
            var searchbox = this.$('#search');
            if(searchbox) {
                searchbox.val('');
            }

            this.options.router.navigate("home", {trigger: true});
        },

        navigateMyRecipes: function(e) {
            e.preventDefault();

            this.options.router.navigate("recipes/" + this.model.get('username'), {trigger: true});
        },

        navigateMyFavorites: function(e) {
            e.preventDefault();

            this.options.router.navigate("favorites/" + this.model.get('username'), {trigger: true});
        },

        searchRecipes: function(e) {
            if(e.which === 13) {

                var term = this.$('#search').val();
                this.options.router.navigate("search/" + term, {trigger: true});
            }
        },

        showProfile: function(e) {
            e.preventDefault();
        }
    });
})();
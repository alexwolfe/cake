(function(){
    'use strict';

    /* globals Backbone, Cake, Mustache */

    Cake.Views.Recipe = Backbone.View.extend({
        template: $('#template_recipe').html(),
        tagName: 'article',
        className: 'recipe animated fadeInDown',

        events: {
            'click': 'showFullRecipe',
            'click .edit': 'editRecipe'
        },

        initialize: function() {
            this.listenTo(this.options.user, 'change', this.render);
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        render: function() {
            var data = this.model.toJSON();
            var template =  Mustache.to_html(this.template, data);
            this.$el.html(template);

            this.showEditButton();

            return this;
        },

        showEditButton: function() {
            var accessToken = this.options.user.get('accessToken');

            //MAKE SURE THE USER IS AUTHENTICATED FIRST
            if(accessToken) {
                this.$el.append('<a href="#" class="edit button button-tiny button-flat-primary button-rounded">edit</a>');
            }
        },

        editRecipe: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var userid = this.options.user.id;
            var ownerid = this.model.get('ownerid');

            //MAKE SURE THE USER IS AUTHENTICATED FIRST
            if(userid === ownerid) {
                var form = new Cake.Views.RecipeForm({
                    collection: this.collection,
                    model: this.model,
                    user: this.options.user
                });

                $(document.body).append(form.el);
                form.render();
            }
        },

        showFullRecipe: function(e) {
            e.preventDefault();

            var fullRecipe = new Cake.Views.RecipeFull({
                model: this.model,
                collection: this.collection,
                user: this.options.user
            });

            $(document.body).append(fullRecipe.el);
        }


    });
})();
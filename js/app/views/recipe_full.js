(function(){
    'use strict';

    /* globals Backbone, Cake, Mustache */

    Cake.Views.RecipeFull = Backbone.View.extend({
        template: $('#template_recipe_full').html(),
        tagName: 'article',
        className: 'recipe recipe-full animated fadeInDown',

        events: {
            'click .edit': 'editRecipe'
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);

            this.render();
        },

        render: function() {
            var data = this.model.toJSON();
            var template =  Mustache.to_html(this.template, data);

            this.overlay = $('<div class="overlay"></div>');
            this.overlay.on('click', function(e) {
                e.preventDefault();
                this.close();
            }.bind(this));

            $(document.body).append(this.overlay);


            $('#app').addClass('blur');
            this.$el.html(template);

            this.showEditButton();

            return this;
        },

        close: function() {

            this.$el.fadeOut(function() {
                $('#app').removeClass('blur');
                this.overlay.remove();
                this.remove();
            }.bind(this));
        },

        showEditButton: function() {
            var accessToken = this.options.user.get('accessToken');

            //MAKE SURE THE USER IS AUTHENTICATED FIRST
            if(accessToken) {
                this.$el.append('<a href="#" class="edit button button-small button-flat-primary button-rounded">edit</a>');
            }
        },

        editRecipe: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var userid = this.options.user.id;
            var ownerid = this.model.get('ownerid');

            //MAKE SURE THE USER IS AUTHENTICATED FIRST
            if(userid === ownerid) {
                $('#app').removeClass('blur');
                this.overlay.remove();
                this.remove();

                var form = new Cake.Views.RecipeForm({
                    collection: this.collection,
                    model: this.model,
                    user: this.options.user
                });

                $(document.body).append(form.el);
                form.render();
            }
        }
    });
})();
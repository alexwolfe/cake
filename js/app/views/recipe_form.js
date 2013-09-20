(function(){
    'use strict';

    /* globals Backbone, Cake, Mustache */

    Cake.Views.RecipeForm = Backbone.View.extend({
        template: $('#template_recipe_form').html(),
        templateIngredient: '<input type="text" value="" name="ingredients" class="ingredient" placeholder="enter an ingredient..." />',
        className: 'recipe-form',

        events: {
            'click .cancel': 'closeForm',
            'click .add-ingredient': 'addIngredient'
        },

        initialize: function() {
            _.bindAll(this, 'dragOver', 'dropImage', 'readFile');
            this.model = this.model || new Cake.Models.Recipe();
            this.fileReader = new FileReader();
        },

        render: function() {
            var data = this.model.toJSON();
            data.mylabels = this._getLabelString(data.labels);
            var template =  Mustache.to_html(this.template, data);

            $('#app').addClass('blur');

            this.$el.html(template);
            this.activateValidation();
            this.activeDropArea();

            return this;
        },

        _getLabelString: function(labels) {
            var labelArray = [];

           _.each(labels, function(label) {
                labelArray.push(label.name);
           });

           return labelArray.join();
        },

        activateValidation: function() {
            this.$('form').validate({
                rules: {
                    name: {required: true},
                    directions: {required: true}
                },
                submitHandler: function(form) {
                    this.saveData(form);
                }.bind(this)
            });
        },

        activeDropArea: function() {
            this.droparea = document.getElementById('dropzone');
            this.droparea.addEventListener('dragover', this.dragOver, false);
            this.droparea.addEventListener('drop', this.dropImage, false);
        },

        addIngredient: function(e) {
            e.preventDefault();

            var field = Mustache.to_html(this.templateIngredient);

            this.$('#ingredient-list').append(field);
        },

        saveData: function(form) {
            var $form = $(form);
            var ingredientFields = $form.find('.ingredient');
            var ingredients = [];
            var rawLabels =  form.labels.value.split(',');
            var labels = [];

            // GET VALUE FOR EACH INGREDIENT FIELD
            _.each(ingredientFields, function(field) {
                //PUSH AN OBJECT TO THE INGREDIENTS ARRAY
                ingredients.push({description: field.value});
            });

            //GET LABELS
            _.each(rawLabels, function(label) {
                //PUSH AN OBJECT TO THE INGREDIENTS ARRAY
                labels.push({name: label});
            });


            //SET VALUES ON MODEL
            this.model.set({
                ownerid: this.options.user.id,
                name: form.name.value,
                directions: form.directions.value,
                ingredients: ingredients,
                labels: labels
            });

            //ADD A NEW ITEM TO THE COLLECTION;
            this.collection.add(this.model);

            this.closeForm();
        },


        dropImage: function(e) {
            e.stopPropagation();
            e.preventDefault();

            //GET FILE
            var files = e.dataTransfer.files;

            //CREATE ADS
            this.updateImage(files);
        },

        dragOver: function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        },

        updateImage: function(files) {
            var file = files[0];

            this.fileReader.onloadend = this.readFile;
            this.fileReader.readAsDataURL(files[0]);
        },

        readFile: function (e) {
            if (e.target && e.target.result) {

                //CREATE A REFERENCE TO THE IMAGE DATA
                var imageData = e.target.result + '';

                //SET IMAGE DATA ON MODEL
                this.model.set({image: imageData});

                //CREATE AN IMAGE
                this.$('#dropzone').html('<img src="' + imageData + '" />');
            }
        },

        closeForm: function(e) {
            if(e) {
                e.preventDefault();
            }

            this.$el.fadeOut(function() {
                $('#app').removeClass('blur');
                this.remove();
            }.bind(this));
        }
    });
})();
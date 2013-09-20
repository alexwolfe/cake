(function(){
    'use strict';

    /* globals Backbone, Cake */

    Cake.Models.Recipe = Backbone.Model.extend({
        url: '/recipes',
        firebase: new Firebase("https://wolfe.firebaseio.com/recipes"),

        defaults: function() {
            return {
                ownerid: null,
                name: '',
                subtitle: '',
                ingredients: [{description: 'enter an ingrediant...'}], //[{description: 'enter ingredients'}, {description: 'enter ingredients'}, {description: 'enter ingredients'}],
                directions: '',
                labels: [{name: 'food'}], //[{name: ''}],
                likes: [{user: '123'}], //[id, id, id]
                image: ''
            };
        }

    });
})();
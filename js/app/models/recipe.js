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
                ingredients: [{description: ''}], //[{description: 'enter ingredients'}, {description: 'enter ingredients'}, {description: 'enter ingredients'}],
                directions: '',
                labels: [], //[{name: ''}],
                likes: [], //[id, id, id]
                image: ''
            };
        }

    });
})();
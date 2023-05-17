Backbone.Model.prototype.idAttribute = '_id';
// Backbone Model
var Blog = Backbone.Model.extend({
    default: {
        author: '',
        title: '',
        url: ''
    }
});
//Backbonee Collection
var Blogs = Backbone.Collection.extend({
    url: 'http://localhost:3000/api/blogs'
});
// var blog1 = new Blog({
//     author: 'John',
//     title: 'My First Blog Post',
//     url: 'http://www.google.com'
// });

// var blog2 = new Blog({
//     author: 'jays',
//     title: 'My Second Blog Post',
//     url: 'http://www.bing.com'
// });
var blogs = new Blogs([]);

var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    initialize: function () {
        this.template = _.template($('.blogs-list-template').html());
    },
    events: {
        'click .edit-blog': 'edit',
        'click .delete-blog': 'delete',
        'click .cancel': 'cancel',
        'click .update-blog': 'update'
    },

    edit: function () {
        $('.edit-blog').hide();
        $('.delete-blog').hide();
        $('.cancel').show();
        $('.update-blog').show();

        var author = this.$('.author').html();
        var title = this.$('.title').html();
        var url = this.$('.url').html();

        this.$('.author').html('<input type="text" class = "form-control author-update" value="' + author + '" >');
        this.$('.title').html('<input type="text" class = "form-control title-update" value="' + title + '" >');
        this.$('.url').html('<input type="text" class = "form-control url-update" value="' + url + '" >');

    },
    update: function () {
        this.model.set('author', $('.author-update').val());
        this.model.set('title', $('.title-update').val());
        this.model.set('url', $('.url-update').val());

        this.model.save({
            success: function (response) {
                console.log('Successfully UPDATE blog with _id:' + response.toJSON()._id);
            },
            error: function () {
                ; console.log('Failed to UPDATE blog !!!');
            }
        });
    },
    cancel: function () {
        blogsView.render();
    },
    delete: function () {
        this.model.destroy({
            success: function (response) {
                console.log('Successfully DELETE blog with _id:' + response.toJSON()._id);
            },
            error: function () {
                ; console.log('Failed to DELETE blog !!!');
            }
        });
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
// Backbone View Collection
var BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogs-list'),
    initialize: function () {
        var self = this;
        this.model.on('add', this.render, this);
        this.model.on('change', function () {
            setTimeout(function () { self.render(); }, 30);
        }, this);
        this.model.on('remove', this.render, this);

        this.model.fetch({
            success: function (response) {
                _.each(response.toJSON, function (item) {
                    console.log('Successfully GOT blog with _id:' + item._id);
                });
            },
            error: function () {
                console.log('Error GOT blog with _id:' + item._id);
            }
        });
    },

    render: function () {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function (blog) {
            self.$el.append((new BlogView({ model: blog })).render().$el);
        });
        return this;
    }

});

//var blogsView = new BlogView();
var blogsView = new BlogsView();


$(document).ready(function () {
    $('.add-blog').on('click', function () {
        var blog = new Blog({
            author: $('.author-input').val(),
            title: $('.title-input').val(),
            url: $('.url-input').val()
        });
        $('.author-input').val('');
        $('.url-input').val('');
        $('.title-input').val('');
        blogs.add(blog);
        blog.save(null, {
            success: function (response) {
                console.log('Successfully SAVED blog with _id:' + response.toJSON()._id);
            },
            error: function () {
                console.log('Failed to SAVED blog !!!');

            }
        });
        console.log(blogs.toJSON());

    })
});


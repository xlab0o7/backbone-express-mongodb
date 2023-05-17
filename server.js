const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

mongoose
    .connect('mongodb://127.0.0.1:27017/blogs-db')
    .catch(error => console.log(error));
var Schema = mongoose.Schema;
var BlogSchema = new Schema({
    author: String,
    title: String,
    url: String,
});
mongoose.model('Blog', BlogSchema);
var Blog = mongoose.model('Blog');
// var blog = new Blog({
//     author: 'John',
//     title: 'My First Blog Post',
//     url: 'http://www.google.com'
// });
// blog.save();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// ROUTES
app.get('/api/blogs', function (req, res) {
    Blog.find(function (err, docs) {
        docs.forEach(function (item) {
            console.log('Received a Get request for _id:' + item._id);
        })
        res.send(docs);
    });
});
app.post('/api/blogs', function (req, res) {
    console.log('Received a POST request');
    for (var key in req.body) {
        console.log(key + ':' + req.body[key]);
    }
    var blog = new Blog(req.body);
    blog.save(function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            res.send(doc);
        };

    });
});

app.delete('/api/blogs/:id',
    function (req, res) {
        console.log('Received a DELETE request for _id:' + req.params.id);
        Blog.remove({ _id: req.params.id },
            function (err) {
                res.send({ _id: req.params.id })
            });
    });

app.put('/api/blogs/:id', function (req, res) {
    console.log('Received a UPDATE request for _id:' + req.params.id);
    Blog.update({ _id: req.params.id }, req.body, function (err) {
        res.send({ _id: req.params.id })
    })
})

var port = 3000;
app.listen(port)
console.log('server is running on port ' + port);
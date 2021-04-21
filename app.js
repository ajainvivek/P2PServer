var express = require('express'),
    mailer = require('express-mailer'),
    Firebase = require('firebase'),
    bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3200;

mailer.extend(app, {
  from: 'p2pdrop@gmail.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'p2pdrop@gmail.com',
    pass: ''
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var getUID = function () {
  var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
  return uid;
}


app.post('/email', function (req, res) {
  var uid = req.body.uid;
  var email = req.body.email;
  var guid = getUID();
  var verificationCodeRef = new Firebase('https://p2pdrop.firebaseio.com/users/' + uid + '/verificationCode');

  app.mailer.send('email', {
    to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
    subject: 'Verfication Code', // REQUIRED.
    verificationCode: guid // All additional properties are also passed to the template as local variables.
  }, function (err) {
    if (err) {
      // handle error
      res.send({
        status : "fail",
        error : err
      });
      return;
    }

    verificationCodeRef.set(guid, function (error) {
      if (error) {
        res.send({
          status : "fail"
        });
      } else {
        res.send({
          status : "success",
          guid : guid
        });
      }
    });
  });
});

app.listen(port, function () {
  //console.log("Running port " + port);
});

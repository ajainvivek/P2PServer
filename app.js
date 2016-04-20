var express = require('express'),
    mailer = require('express-mailer');

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
    pass: 'ajay2@tilak'
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/email', function (req, res) {
  app.mailer.send('email', {
    to: 'ajainvivek07@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
    subject: 'Verfication Code', // REQUIRED.
    verificationCode: 'Ox123fdf' // All additional properties are also passed to the template as local variables.
  }, function (err) {
    if (err) {
      // handle error
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.send('Email Sent');
  });
});

app.listen(port, function () {
  //console.log("Running port " + port);
});

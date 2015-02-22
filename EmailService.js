/**
 * Created by swapnil on 21-Feb-15.
 */

var nodemailer = require("nodemailer");
var emailTemplates = require('email-templates');
var path = require('path');
var templatesDir = path.resolve(__dirname, 'templates')
var emailDir = path.resolve(__dirname, 'templates/email')
var jade = require('jade');
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "swapnilj88@gmail.com",
        pass: "swapnil_1985"
    }
});

module.exports.sendEmail = function() {

    emailTemplates(templatesDir, function(err, template) {

        if (err) {
            console.log(err);
        } else {

            // ## Send a single email

            // Prepare nodemailer transport object
            var smtpTransport = nodemailer.createTransport("SMTP", {
                service: "Gmail",
                auth: {
                    user: "swapnilj88@gmail.com",
                    pass: "swapnil_1985"
                }
            });

            // An example users object with formatted email function
            var locals = {
                email: 'swapnilj88@gmail.com'
            };

            // Send a single email
            template('email', locals, function (err, html) {
                if (err) {
                    console.log(err);
                } else {
                    var fn = jade.render(html, {filename: emailDir, user:{name : 'Anoop'}});
                    smtpTransport.sendMail({
                        from: 'swapnilj88@gmail.com',
                        to: locals.email,
                        subject: 'test mail!',
                        html: fn
                    }, function (err, responseStatus) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(responseStatus.message);
                        }
                    });
                }
            });
        }
    });
};
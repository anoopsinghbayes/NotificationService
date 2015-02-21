///*
//*
// * Created with JetBrains WebStorm.
// * User: Padmaraj
// * Date: 01/02/15
// * Time: 00:14
// * To change this template use File | Settings | File Templates.
//
//
// Notification:
// Provide common structure for all types of notifications i.e. Email,SMS,UI
// Schema:
// 1.Level---It is notification seviarity
// 2.Mode---It will define using which mode user/client will be notified.
// 3.Template---Here template file name or path will be stored which will be used to send notification.
// 4.Data--JSON Data will be stored in notification collection which will be inserted in template before sending to client.
//

//
//
//*/
//
////'use strict';
//
//
// //* Module dependencies.



/*

getMongooseModel
getQuery
getNotificationData
getTenants
getCollection


 */



var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
require('mongoose-multitenant')('_');
var util = require('util');
var NotificationLevelEnum =['info','warn','error'];
var NotificationModeEnum=['sms','email','ui'];
var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
//var db= require('mongodb');



var notification= new Schema({

    created:{
        type: Date,
        default:Date.now
    },
    tenantId:{
                type:String
        },
    userAck:{
                type:Boolean
        },
    details:[{
                level:
                {
                    type:String,
                    enum:NotificationLevelEnum
                },
                mode:
                {
                    type:String,
                    enum:NotificationModeEnum
                },

                template:{
                    type:String
                },
                data:{
                    type:mongoose.Schema.Types.Mixed
                },
                status:{
                    type:String
                }

                }]
});




function pushNotification(){





        /*var notification =getModel(itemCategory,req.user.tenant);
        var vm= new itemModel(req.body);
        console.log("vehicle",req.body);
        vm.user = req.user;

        vm.save(function(err) {
            if (err) {
                return res.send('500', {
                    errors: err,
                    vm: vm
                });
            } else {
                res.jsonp(vm);
            }
        });
*/



}



function push(){

    //forEach(var tenant in )

    getTenants('user',pushItemCollectionData)

    //pushItemCollectionData();

    pushNotification();
    console.log('You will see this message every second');
};


function getTenants(modelName,callBack){



    var MongoClient = require('mongodb').MongoClient
        , Server = require('mongodb').Server
        , format = require('util').format;
/*
    var mongoClient = new MongoClient(new Server('localhost', 27017));
    mongoClient.open(function(err, mongoClient) {
        var db1 = mongoClient.db("local");

        db1.collection('t1_orders').find({}).toArray(function(err,result){

            if(err) return err;

            else
             console.log(result);
                //callBack(result);

        });


        mongoClient.close();
    });
*/



    MongoClient.connect('mongodb://127.0.0.1:27017/mean-dev', function(err, db) {
        if(err) throw err;

        var collection = db.collection('users');

            // Locate all the entries using find
            collection.find({tenant:{$exists:true}}).toArray(function(err, results) {

                results.forEach(function(data){
                    console.log(data.tenant);
                }

                );

                // Let's close the db
                db.close();
            });

    })






/*
    var tenant = mongoose.model(modelName);
    tenant.find({tenant:{$exists:true}},function(err,result){

        if(err) return err;
        //  console.log(result);
        else
        callBack(result);

    });
*/

}


function pushItemCollectionData(tenants){

console.log(tenants);

    /*tenants.forEach();
    var item = mongoose.mtModel('t1.Item');

    var mongoQuery = [{}];





    item.find({},function(err,result){



        for(var i = 0; i < result.length; i++) {
            var item = result[i];


            console.log(item._id);
        }



        //console.log(itm);



    });

*/

}






module.exports.serviceStart = function() {

    new CronJob('* * * * * *', function(){
        push();
    }, null, true, "America/Los_Angeles");
};




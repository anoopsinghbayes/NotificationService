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
//require('mongoose-multitenant')('_');
var util = require('util');
var NotificationLevelEnum =['info','warn','error'];
var NotificationModeEnum=['sms','email','ui'];
var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');

//var db= require('mongodb');
var url='mongodb://127.0.0.1:27017/mean-dev';
var MongoClient = require('mongodb').MongoClient
    , Server = require('mongodb').Server
    , format = require('util').format;

var moment = require('moment');
mongoose.connect(url);

var notificationSchema= new Schema({

    created:{
        type: Date,
        default:Date.now
    },
    tenantId:{
                type:String
        },
    userAck:{
                type:Boolean,
                default:false
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
                isNotified:{
                    type:Boolean,
                    default:false
                }

                }]
});

var Notification = mongoose.model('notification',notificationSchema);

function getVehicleDocsNotificationObj(tenantId,data){



    var notify=new Notification(
    {
        tenantId:tenantId,
        details:[
            {
                level:"info",
                mode:"ui",
                template:"uitemplate",
                data:data


            },
            {
                level:"info",
                mode:"email",
                template:"emailtemplate",
                data:data

            }



        ]


    });

    console.log(notify);

    pushNotification(notify);

}



function pushNotification(data){



    //console.log('pushNotification   '+ data);


        //var not =getModel(data);
        var vm= new Notification(data);
        //console.log("vehicle",req.body);
        //vm.user = req.user;

    vm.save(function(err){

        if(err) console.log(err)
        else{

            console.log(vm);
        }

    });




}



function push(){

    //forEach(var tenant in )

    getTenants('user',pushItemCollectionData)

    //pushItemCollectionData();


    console.log('You will see this message every second');
};


function getTenants(modelName,callback){

    MongoClient.connect(url, function(err, db) {
        if(err) throw err;

        var collection = db.collection('users');

            // Locate all the entries using find
            collection.find({tenant:{$exists:true}}).toArray(function(err, results) {


                results.forEach(function(data){

                        callback(data.tenant);
                    }


                );

                // Let's close the db
                db.close();
            });

    })

}





function pushItemCollectionData(tenantId){



    var tempDate=moment().add(10, 'days');
    var prevDate= new Date(tempDate.toISOString());
    var today= new Date(new Date().toISOString());
    //console.log(tempDate.toString());
    //console.log(today.toString());

    var myQuery={$and:[{"__t" : "VehicleDocs"} , {"expDate": {$lte:prevDate }} ,{"expDate": {$gte:today }}]};

    //console.log(myQuery);
    MongoClient.connect(url, function(err, db) {
        if(err) throw err;

        var item =  db.collection(tenantId+'_items');



        item.find(myQuery).toArray(function(err, results) {


            results.forEach(function(data){


                    getVehicleDocsNotificationObj(tenantId,data)
                    pushNotification(data);
                    console.log('pushItemCollectionData  '+data.expDate);
                }


            );


            db.close();
        });

    })




}






module.exports.serviceStart = function() {

    new CronJob('* * * * * *', function(){
        push();
    }, null, true, "America/Los_Angeles");
};




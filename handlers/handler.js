'use strict';
const AWS = require('aws-sdk');
const moment = require('moment');
const {v4: uuid} = require('uuid');
const nodemailer = require('nodemailer')

const response = require('./../utilities/responseUtil');
const emailer = require('./sendEmail');
const responseUtil = require('./../utilities/responseUtil');

const options = {};

try {
  if (process.env.IS_OFFLINE) {
    options.region = 'localhost';
    options.endpoint = 'https://localhost:8000';
  } else {
    options.region = 'us-east-2';
  }
} catch (e) {
  console.log(e)
  
}
// creates new instance of DynamoDB
const dDB = new AWS.DynamoDB.DocumentClient(options);

const tablename = process.env.MEMBERS;


// setting up nodemailer
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'acmwaynestateuniversity@gmail.com',
//     pass: 'thegiver1'
//   }
// })

// const send_email = async (em) => {
//   let mailOptions = {
//     from: 'acm.waynestateuniversity@gmail.com',
//     to: em,
//     subject: 'You\'re Registered for WSU Nexus!',
//     text: 'worked, now replace this!' 
//   }

//   return await transporter.sendMail(mailOptions);
// }




module.exports = {
  // evt - event, runs any event specified in command to run function
  // ex. sls invoke local -f hello -p event.json
  // ctx - contex,
  handler: async (evt, ctx) => {
    console.log(evt)
    console.log(ctx)

    return  response.Build(200, {
      'name': 'nodejs dev',
      'message': 'I am from the handler'
    })
  },

  newMember: async (evt, ctx) => {
    // function adds new members to db
    
    const data = JSON.parse(evt.body);
    const timestamp = new Date();
    const formattedTime = moment(timestamp).format();

    if (!data.Email) {
      return response.Build(403, {
        Error: 'Email Required!',
        Message: data
      });
    }


    // secondary index query to check if email exists 
    let query_params = {
      TableName: tablename,
      IndexName: "EmailIndex",
      KeyConditionExpression: "#key = :em",
      ExpressionAttributeNames: {
        "#key": "Email",
      },
      ExpressionAttributeValues: {
        ":em": data.Email,
      },
    }

    let result = await dDB.query(query_params).promise();

    if (!result.Items[0]) {

      const newMem = {
        TableName: process.env.MEMBERS,
        Item: {
          ID: uuid(),
          Email: data.Email,
          FirstName: data.FName ? data.FName : '',
          LastName: data.LName ? data.LName : '',
          Gender: data.Gender ? data.Gender : '',
          School: data.School ? data.School : '',
          // current level of study
          GradeLevel: data.Grade ? data.Grade : '',
          Major: data.Major ? data.Major : '',
          Skills: data.Skills ? data.Skills : '',
          // wants a random group chosen for them
          WantsRandom: data.Random ? data.Random : 0,
          // required, for only wayne state students
          AccessID: data.AccessID ? data.AccessID : '',
          // required, 18 and older
          Age: data.Age ? data.Age : '',
          CreatedAt: formattedTime
        }
      }
  
      
      try {

        const res = await dDB.put(newMem).promise();
        console.log('Database: ', res);
        
        // TODO: Add nodemailer command, which sends a email to user w/ Discord Link!
        // let email_sent = await send_email('thegimreper@gmail.com');
        let email_sent = await emailer.email([data.Email], 'random', 'nolo dolo yolo great now reformat this');

        if (!email_sent) {
          console.log(email_sent)
          throw 'Email Sending Error';
        }

        return response.Build(200, {
          body: newMem.Item
        });
        
      } catch (e) {
        console.log('DYNAMODB PUT or Email ERROR: ', e);
        return response.Build(403, {
          Error: 'DynamoDB Save or Email Send Error',
          Message: e,
        });
      }
    } else {
      return response.Build(200, {
        Error: "Email Already Exists!",
        Message: result.Items[0]
      });
    }

  }, 


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

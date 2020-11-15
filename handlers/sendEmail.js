const AWS = require('aws-sdk');

const SES = new AWS.SES();

module.exports = {
    email: async (to, subject, text, from='acmwaynestateuniversity@gmail.com') => {

        console.log('to:', to,'subject:', subject,'text:', text,'from:', from, 'len:', to.length);

        if (!to.length > 0) {
            return 0;
        }

        const params = {
            Destination: {
                ToAddresses: to
            },
            Message: {
                Subject: { Data: subject },
                Body:  {
                    Text: { Data: text }
                },
            },
            Source: from
        };

        try {
            await SES.sendEmail(params).promise();
            return 1;
        } catch (e) {
            console.error('Email Sending Email');
            console.log('Email Sending Email');
            return 0;
        }

    }
}
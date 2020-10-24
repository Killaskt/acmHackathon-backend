# ACM Hackathon Website Backend
- Connected to AWS 
- Utilizes severless, Dynamo, etc.


Must configure ur own AWS account
- info on that can be found at : https://www.serverless.com/framework/docs/providers/aws/guide/credentials
- basically create an AWS acc
- download serverless globally on PC 
- add a aws profile
- then go ahead to deploy step

First Clone and Type:
npm i or npm install 
- downloads all dev and regular dependencies

To Local Deploy (w/ serverless offline):
npm run dev

To Deploy:
sls deploy --aws-profile acmHackathon


Deploying DynamoDB:



---- endpoints ----
- saveMember (POST)
-------------------

---- dev dependencies -----

- serverless-dynamodb-local
--- allows you to run dynamodb locally

- serverless-offline
--- allows you to run aws server locally before deploying to cloud

---------------------------

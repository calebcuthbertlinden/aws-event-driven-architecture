# AWS Serverless with CDK
Use AWS CDK as IaC, and deploy and manage your 'stacks' through AWS CloudFormation

## Getting started
https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html

### Install CDK
Install the CDK using npm
```
npm install -g aws-cdk
```

Verify the installation
```
cdk --version
```

### Install the AWS toolkit for VSCode
https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/setup-toolkit.html
https://marketplace.visualstudio.com/items/?itemName=AmazonWebServices.aws-toolkit-vscode

## Create app
You need an empty directory to create an app
```
mdkir cdk-example
cd cdk-example
```

Create the app using the cdk
```
cdk init app --language typescript
```

## Deploying

### Connect account
```
aws configure
# Follow prompts to enter keys and region
```

### Synth
This synthesises a CDK app and stack into a SAML template that CloudFormation uses to update stacks.

```
cdk synth {StackName}
```

### Deploy
This uses CloudFormation to deploy the templated stacks that were synth'ed in the previous step to the account.

```
cdk deploy {StackName}
```

You should be able to follow the process of deployment in the terminal, but you will also be able to see the Stacks deploying/updating on AWS CloudFormation on the console.

## Implement a few queues and lambdas

### SQS

### Lambda

### DynamoDB
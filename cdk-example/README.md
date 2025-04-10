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

## Implement a few queues and lambdas
The aws cdl library gives us various constructs we can use to define instances of different services. <br/>
These services get defined in a *-stack.ts file
```
export class CdkExampleStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // Define resources
    }
}
```

### SQS
`aws-cdk-lib/aws-sqs` <br/>
```
new sqs.Queue(this, 'CdkFirstQueue', {
    visibilityTimeout: cdk.Duration.seconds(300),
});
```

### Lambda
`aws-cdk-lib/aws-lambda` <br/>
```
new lambda.Function(this, resourceName, {
    functionName: functionName,
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: `${functionName}.handler`,
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    memorySize: 256,
    timeout: Duration.seconds(10),
    environment: {
        STAGE: 'dev',
        LOG_LEVEL: 'info',
        TARGET_QUEUE_URL: queueUrl,
    },
    description: description,
    tracing: lambda.Tracing.ACTIVE,
    logRetention: logs.RetentionDays.ONE_WEEK,
})
```
#### Lambda implementations (meat and potatoes)
You can use many different languages for Lambda, in this project there are a few examples: <br/>
`Typescript`, `Java`

[Typescript example](/lib/example/lambda/README.md) <br/>
[Java example](/lib/java-example/lambda/README.md)

### DynamoDB
`aws-cdk-lib/aws-dynamodb` <br/>
```
new dynamo.Table(this, 'CdkEventStateTable', {
    partitionKey: {
    name: 'id',
    type: dynamo.AttributeType.STRING,
    },
    billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
})
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

You should be able to follow the progress of deployment in the terminal, but you will also be able to see the Stacks deploying/updating on AWS CloudFormation on the console.
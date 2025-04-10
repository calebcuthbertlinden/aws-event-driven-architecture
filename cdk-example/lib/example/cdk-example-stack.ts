import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as path from 'path';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';

export class CdkExampleStack extends cdk.Stack {

  private readonly firstQueue: sqs.Queue;
  private readonly firstLambda: lambda.Function;

  private readonly secondQueue: sqs.Queue;
  private readonly secondLambda: lambda.Function;

  private readonly thirdQueue: sqs.Queue;
  private readonly thirdLambda: lambda.Function;

  private readonly eventStateTable: dynamo.Table;

  private readonly s3Bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Queues to be used in the flow
    // The idea is that a message gets passed from one queue to another
    // We will be able to follow the flow via Lumigo or Dynamodb

    this.firstQueue = new sqs.Queue(this, 'CdkFirstQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
    });
    this.secondQueue = new sqs.Queue(this, 'CdkSecondQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
    });
    this.thirdQueue = new sqs.Queue(this, 'CdkFinalQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    // TODO - use s3 bucket for something
    // this.s3Bucket = new s3.Bucket(this, 'CdkExampleBucket', {
      
    // });

    // Store the event and the state of the event in this table
    // Use this as a quick glimpse to see where things are in the flow
    this.eventStateTable = new dynamo.Table(this, 'CdkEventStateTable', {
      partitionKey: {
        name: 'id',
        type: dynamo.AttributeType.STRING,
      },
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
    });

    // Lambdas that will process data and send to further queues if/when necessary
    this.firstLambda = this.createLambda('FirstLambda', 'first-lambda', 'The first lambda in the flow', this.secondQueue.queueUrl);
    this.firstQueue.grantConsumeMessages(this.firstLambda);
    this.secondQueue.grantSendMessages(this.firstLambda);
    this.firstLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(this.firstQueue, {
        batchSize: 1,
        enabled: true,
      })
    );
    this.s3Bucket.grantReadWrite(this.s3Bucket);

    this.secondLambda = this.createLambda('SecondLambda', 'second-lambda', 'The second lambda in the flow', this.thirdQueue.queueUrl);
    this.secondQueue.grantConsumeMessages(this.firstLambda)
    this.thirdQueue.grantSendMessages(this.secondLambda);
    this.secondLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(this.secondQueue, {
        batchSize: 10,
        enabled: true,
      })
    )

    this.thirdLambda = this.createLambda('ThirdLambda', 'third-lambda', 'The third lambda in the flow', '');
    this.thirdQueue.grantConsumeMessages(this.secondLambda)
    this.thirdLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(this.thirdQueue, {
        batchSize: 10,
        enabled: true,
      })
    )

    // Output values of the various resources created in this stack
    this.createOutputValue('FirstQueueUrl', this.firstQueue.queueUrl);
    this.createOutputValue('FirstQueueArn', this.firstQueue.queueArn);
    this.createOutputValue('SecondQueueUrl', this.secondQueue.queueUrl);
    this.createOutputValue('SecondQueueArn', this.secondQueue.queueArn);
    this.createOutputValue('ThirdQueueUrl', this.thirdQueue.queueUrl);
    this.createOutputValue('ThirdQueueArn', this.thirdQueue.queueArn);
    this.createOutputValue('FirstLambdaArn', this.firstLambda.functionArn);
    this.createOutputValue('SecondLambdaArn', this.secondLambda.functionArn);
    this.createOutputValue('ThirdLambdaArn', this.thirdLambda.functionArn);
    this.createOutputValue('FirstLambdaName', this.firstLambda.functionName);
    this.createOutputValue('SecondLambdaName', this.secondLambda.functionName);
    this.createOutputValue('ThirdLambdaName', this.thirdLambda.functionName);
    this.createOutputValue('EventStateTable', this.eventStateTable.tableName);
  }

  createLambda = (resourceName:string, functionName: string, description: string, queueUrl: string): lambda.Function => {
    const createdLambda = new lambda.Function(this, resourceName, {
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
        STATE_TABLE_NAME: this.eventStateTable.tableName,
      },
      description: description,
      tracing: lambda.Tracing.ACTIVE,
      logRetention: logs.RetentionDays.ONE_WEEK,
    })
    this.eventStateTable.grantReadWriteData(createdLambda);
    return createdLambda;
  }

  createOutputValue = (name: string, value: string) => {
    new cdk.CfnOutput(this, name, {
      value: value,
      exportName: name,
    });
  }
}

import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as path from 'path';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';

export class CdkJavaExampleStack extends cdk.Stack {

  private readonly firstQueue: sqs.Queue;
  private readonly firstLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Queues to be used in the flow
    // The idea is that a message gets passed from one queue to another
    // We will be able to follow the flow via Lumigo or Dynamodb

    this.firstQueue = new sqs.Queue(this, 'CdkJavaFirstQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    // Lambdas that will process data and send to further queues if/when necessary
    this.firstLambda = this.createLambda('JavaFirstLambda', 'FirstLambda', 'The first lambda in the flow', '');
    this.firstQueue.grantConsumeMessages(this.firstLambda);
    this.firstLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(this.firstQueue, {
        batchSize: 10,
        enabled: true,
      })
    );

    // Output values of the various resources created in this stack
    this.createOutputValue('JavaFirstQueueUrl', this.firstQueue.queueUrl);
    this.createOutputValue('JavaFirstQueueArn', this.firstQueue.queueArn);
    this.createOutputValue('JavaFirstLambdaArn', this.firstLambda.functionArn);
    this.createOutputValue('JavaFirstLambdaName', this.firstLambda.functionName);
  }

  createLambda = (resourceName:string, functionName: string, description: string, queueUrl: string): lambda.Function => {
    const createdLambda = new lambda.Function(this, resourceName, {
        functionName,
        runtime: lambda.Runtime.JAVA_21,
        handler: `com.example.${functionName}::handleRequest`,
        code: lambda.Code.fromAsset(path.join(__dirname, 'lambda', 'build', 'dist', 'first-lambda.zip')),
        memorySize: 256,
        timeout: Duration.seconds(10),
        environment: {
          STAGE: 'dev',
          LOG_LEVEL: 'info',
          TARGET_QUEUE_URL: queueUrl,
        },
        description,
        tracing: lambda.Tracing.ACTIVE,
        logRetention: logs.RetentionDays.ONE_WEEK,
    })
    return createdLambda;
  }

  createOutputValue = (name: string, value: string) => {
    new cdk.CfnOutput(this, name, {
      value: value,
      exportName: name,
    });
  }
}

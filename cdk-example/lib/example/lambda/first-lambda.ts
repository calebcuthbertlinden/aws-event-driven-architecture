import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const sqsClient = new SQSClient({});
const dynamoClient = new DynamoDBClient({});

export const handler = async (event: any): Promise<void> => {
  
    console.log("First lambda is receiving events");

    for (const record of event.Records) {
        console.log('Message ID:', record.messageId);
        console.log('Body:', record.body);

        // Create and store an event (transaction) in DynamoDB
        const dynamoParams = {
            TableName: process.env.STATE_TABLE_NAME!,
            Item: {
                id: record.messageId,
                body: record.body,
                state: "NEW"
            },
        };
        try {
            const command = new PutCommand(dynamoParams);
            const result = await dynamoClient.send(command);
            console.log('DynamoDB item written, ID:', result?.Attributes?.id);
        } catch (err) {
            console.error('Error writing to DynamoDB:', err);
        }

        // Passing the event on to the next queue
        const params = {
            QueueUrl: process.env.TARGET_QUEUE_URL!,
            MessageBody: JSON.stringify({
                prevMessageId: record.messageId,
                prevBody: record.body,
            }),
        };
        try {
            const command = new SendMessageCommand(params);
            const result = await sqsClient.send(command);
            console.log('Message sent, ID:', result.MessageId);
        } catch (err) {
            console.error('Error sending SQS message:', err);
        }
    }
    
};
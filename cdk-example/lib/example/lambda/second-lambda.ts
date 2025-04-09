import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const sqsClient = new SQSClient({});
const dynamoClient = new DynamoDBClient({});

export const handler = async (event: any): Promise<void> => {
  
    console.log("Second lambda is receiving events");

    for (const record of event.Records) {
        console.log('Message ID:', record.messageId);
        console.log('Body:', record.body);

        const body = JSON.parse(record.body)

        const params = {
            QueueUrl: process.env.TARGET_QUEUE_URL!,
            MessageBody: JSON.stringify({
                prevMessageId: body.prevMessageId,
                prevBody: body.prevBody,
            }),
        };

        // Update state of item to 'PROCESSING'
        const dynamoParams = {
            TableName: process.env.STATE_TABLE_NAME!,
            Key: {
                id: body.prevMessageId,
            },
            UpdateExpression: 'SET #state = :state',
            ExpressionAttributeNames: {
                '#state': 'state',
            },
            ExpressionAttributeValues: {
                ':state': 'PROCESSING',
            },
        };
        try {
            const command = new UpdateCommand(dynamoParams);
            const result = await dynamoClient.send(command);
            console.log('DynamoDB item updated, ID:', result?.Attributes?.id);
        } catch (err) {
            console.error('Error updating DynamoDB:', err);
        }
        
        try {
            const command = new SendMessageCommand(params);
            const result = await sqsClient.send(command);
            console.log('Message sent, ID:', result.MessageId);
        } catch (err) {
            console.error('Error sending SQS message:', err);
        }
    }
};
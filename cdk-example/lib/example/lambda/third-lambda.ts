import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamoClient = new DynamoDBClient({});

export const handler = async (event: any): Promise<void> => {
  
    console.log("Third lambda is receiving events");
    console.log("We have made it to the end...");

    for (const record of event.Records) {
        console.log('Message ID:', record.messageId);
        console.log('Body:', record.body);
        const body = JSON.parse(record.body)

        // Update state of item to 'PROCESSED
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
                ':state': 'PROCESSED',
            },
        };
        try {
            const command = new UpdateCommand(dynamoParams);
            const result = await dynamoClient.send(command);
            console.log('DynamoDB item updated, ID:', result?.Attributes?.id);
        } catch (err) {
            console.error('Error updating DynamoDB:', err);
        }
    }
};
# AWS Serverless with IaC
A project demonstrating how to set up an AWS Serverless Event Driven architecture, using various IaC's.

- [Connect AWS account](#connect-aws-account)
- [IaC examples](#iac-examples)
    - [AWS CDK](./cdk-example/README.md)
    - [Terraform](./terraform-example/README.md)
- [After deploying](#after-deploying)
- [Pipelines](#pipelines)
    - [AWS CDK](./.github/workflows/cdk-deploy.yaml)
    - [Terraform](./.github/workflows/terraform-deploy.yaml)
- [Monitoring](#monitoring)


## Connect AWS account

### Install the AWS CLI
Full user guide [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) for installing on different OS's <br/>
After installing:
```
aws --version
```

### Configure account
[IAM](https://us-east-1.console.aws.amazon.com/iam/home?region=eu-west-1#/users/details/calebdev?section=security_credentials) for security credentials - you would be using `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
```
aws configure
# Follow prompts to enter keys and region
# This will use the CLI access keys you created in IAM on AWS
```

## IAC examples

### AWS CDK
See [AWS CDK example](./cdk-example/)

### Terraform
See [AWS Terraform example](./terraform-example/)

## After deploying
You can test either architecture once you've deployed by sending a message onto the first queue, by using the script from [here](./scripts/send_message.sh)
```
sh send_message.sh --queue-url {first_sqs_url}
```
Use AWS [CloudWatch](https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#logsV2:log-groups) to see the logs <br/>
Or navigate to your deployed [DynamoDB](https://eu-west-1.console.aws.amazon.com/dynamodbv2/home?region=eu-west-1#tables) table to see the result entries

## Pipelines
This is using Github actions to run the deployment pipelines for both the terraform and cdk projects.<br/>

You will need to have the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` set as repository secrets in the repo.

See [cdk-deploy.yaml](./.github/workflows/cdk-deploy.yaml) <br/>
See [terraform-deploy.yaml](./.github/workflows/terraform-deploy.yaml)

## Monitoring

### Lumigo
[Lumigo](https://lumigo.io/) deploys a Lambda Layer that is able to monitor your Lambda's and send data to the Lumigo platform.

#### Setup

1. Create a Lumigo account
2. Connect to AWS account
3. Deploy the Lumigo Integration stack
![alt text](<assets/lumigo_integration_stack.png>)
4. Wait a few minutes for the setup on Lumigo to complete

View the functions on your account: https://platform.lumigo.io/project/{project_code}/functions?timespan=LAST_DAY <br/>
Or your dashboard: https://platform.lumigo.io/project/{project_code}/dashboard?timespan=LAST_DAY

### Datadog
`TODO`

### AWS Xray
`TODO`
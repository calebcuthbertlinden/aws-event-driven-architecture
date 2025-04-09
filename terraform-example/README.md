# Terraform

## Install Terraform CLI
```
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

### Confirm its working
```
terraform -v
```
You should see something like:
```
Terraform v1.11.3
on darwin_arm64
```

## Set up your Terraform project
This is just an example folder structure to keep things organised
```
terraform-app/
├── lambda/
│   └── index.js
├── main.tf
├── variables.tf
├── outputs.tf
```

## Create Lambda + SQS Infrastructure
The meat and potatoes of your infrastructure and scaffolding

### main.tf
You configure different resources here, and connect them with permissions etc
```
provider "aws" {
  region = "eu-west-1"
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

etc
```

### variables.tf
(optional) - You can define variables if you want to make this configurable.

### outputs.tf
Output the resource names and id's you want to use after deploy
```
output "lambda_name" {
  value = aws_lambda_function.example_lambda.function_name
}

output "queue_url" {
  value = aws_sqs_queue.example_queue.id
}
```

## Lambda

### Write your code
Write your lambda code in lambda/index.js
```
exports.handler = async (event) => {
  console.log("Event received:", event);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success from Terraform Lambda!" }),
  };
};
```

### ZIP it
```
cd lambda
zip ../lambda.zip index.js
cd ..
```

## Deploy
```
terraform init
terraform apply
```

### Deploy script
Find the script [here](./deploy.sh)
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

resource "aws_sqs_queue" "tf_first_queue" {
  name = "TfFirstQueue"
  visibility_timeout_seconds = 300
}

resource "aws_sqs_queue" "tf_second_queue" {
  name = "TfSecondQueue"
  visibility_timeout_seconds = 300
}

resource "aws_sqs_queue" "tf_third_queue" {
  name = "TfThirdQueue"
  visibility_timeout_seconds = 300
}

resource "aws_lambda_function" "first_lambda" {
  function_name = "terraform-first-lambda"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "index.first_lambda"
  runtime       = "nodejs18.x"
  timeout       = 10
  memory_size   = 256
  filename      = "${path.module}/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  environment {
    variables = {
      STAGE            = "dev"
      LOG_LEVEL        = "info"
      TARGET_QUEUE_URL = aws_sqs_queue.tf_second_queue.id
    }
  }
}

resource "aws_lambda_function" "second_lambda" {
  function_name = "terraform-second-lambda"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "index.second_lambda"
  runtime       = "nodejs18.x"
  timeout       = 10
  memory_size   = 256
  filename      = "${path.module}/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  environment {
    variables = {
      STAGE            = "dev"
      LOG_LEVEL        = "info"
      TARGET_QUEUE_URL = aws_sqs_queue.tf_third_queue.id
    }
  }
}

resource "aws_lambda_function" "third_lambda" {
  function_name = "terraform-third-lambda"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "index.third_lambda"
  runtime       = "nodejs18.x"
  timeout       = 10
  memory_size   = 256
  filename      = "${path.module}/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  environment {
    variables = {
      STAGE            = "dev"
      LOG_LEVEL        = "info"
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs_to_lambda" {
  event_source_arn = aws_sqs_queue.tf_first_queue.arn
  function_name    = aws_lambda_function.first_lambda.function_name
  batch_size       = 10
  enabled          = true
}

resource "aws_iam_role_policy" "first_lambda_sqs_policy" {
  name = "lambda-sqs-access"
  role = aws_iam_role.lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        Resource = aws_sqs_queue.tf_first_queue.arn
      }
    ]
  })
}

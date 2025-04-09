output "first_lambda_name" {
  value = aws_lambda_function.first_lambda.function_name
}

output "second_lambda_name" {
  value = aws_lambda_function.second_lambda.function_name
}

output "third_lambda_name" {
  value = aws_lambda_function.third_lambda.function_name
}

output "first_queue_url" {
  value = aws_sqs_queue.tf_first_queue.id
}

output "second_queue_url" {
  value = aws_sqs_queue.tf_second_queue.id
}

output "third_queue_url" {
  value = aws_sqs_queue.tf_third_queue.id
}
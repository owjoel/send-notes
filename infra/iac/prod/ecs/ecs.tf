resource "aws_ecs_cluster" "account_app_cluster" {
  name = "${var.app_name}_account_app_cluster_${var.environment}"
}



resource "aws_ecs_task_definition" "account_app_task" {

  family                   = "${var.app_name}_account_app_task_${var.environment}"
  container_definitions    = <<DEFINITION
  [
    {
      "name": "${var.app_name}_account_app_task_${var.environment}",
      "image": "${var.ecr_repo_url}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": ${var.account_app_container_port},
          "hostPort": ${var.account_app_container_port}
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 512
  cpu                      = 256
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
}

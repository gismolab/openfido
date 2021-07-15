include {
  path = find_in_parent_folders()
}

terraform {
  extra_arguments "common_vars" {
    commands = get_terraform_commands_that_need_vars()

    arguments = [
      "-var-file=${get_parent_terragrunt_dir()}/variables/common.tfvars",
      "-var-file=${get_parent_terragrunt_dir()}/variables/${get_env("TF_VAR_environment")}/postgresql.tfvars"
    ]
  }
}

// Dependency's for this terraform
dependency "vpc" {
  config_path = "../../vpc"
}

// Input values
inputs = {
  vpc_id              = dependency.vpc.outputs.vpc_id
  vpc_default_sg      = dependency.vpc.outputs.vpc_default_sg
  vpc_public_subnets  = dependency.vpc.outputs.vpc_public_subnets
  vpc_private_subnets = dependency.vpc.outputs.vpc_private_subnets
  vpc_db_subnets      = dependency.vpc.outputs.vpc_db_subnets
  vpc_db_subnet_group = dependency.vpc.outputs.vpc_db_subnet_group
}
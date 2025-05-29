terraform {
  backend "s3" {
    bucket = "uberclonebucket0778"
    key    = "EKS/terraform.tfstate"
    region = "ap-south-1"
  }
}



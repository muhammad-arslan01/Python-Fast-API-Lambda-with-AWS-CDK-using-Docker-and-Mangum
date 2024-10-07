=> Include --provenance=false while building image

docker build --provenance=false -t admin-panel-repo . 
docker tag admin-panel-repo:latest 722365352638.dkr.ecr.us-east-1.amazonaws.com/admin-panel-repo:latest 
docker push 722365352638.dkr.ecr.us-east-1.amazonaws.com/admin-panel-repo:latest

=> Use official Python lambda image from aws as being used in Docker file

=> With this image, docker will not run locally

=> Mangum is required to run python Fast api as lambda on aws

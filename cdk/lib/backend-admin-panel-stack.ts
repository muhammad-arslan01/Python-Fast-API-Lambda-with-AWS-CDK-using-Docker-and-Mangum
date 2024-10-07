import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import * as ecr from 'aws-cdk-lib/aws-ecr'; // Import the ECR module

export class BackendAdminPanelStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


       // Reference the existing ECR repository
       const repository = ecr.Repository.fromRepositoryAttributes(this, 'BackendAdminPanelRepository', {
        repositoryName: 'admin-panel-python-repo', // Replace with your ECR repository name
        repositoryArn: `arn:aws:ecr:us-east-1:722365352638:repository/admin-panel-python-repo`,
      });

      const fastApiLambda = new lambda.DockerImageFunction(this, 'BackendAdminPanelLambda', {
        code: lambda.DockerImageCode.fromEcr(repository, {
          tagOrDigest: 'latest', // Use a specific tag or digest if required
        }),
      memorySize: 512,   // Increase memory if needed
      timeout: cdk.Duration.seconds(30),
    });

    // Define an API Gateway and connect it to the Lambda function
    new apigateway.LambdaRestApi(this, 'BackendAdminPanelAPI', {
      handler: fastApiLambda,
      proxy: true,
      defaultCorsPreflightOptions: {
        allowOrigins:apigateway.Cors.ALL_ORIGINS, // Change to your frontend's origin
        allowMethods:apigateway.Cors.ALL_METHODS , // Allow the necessary methods
        allowHeaders:["*"],
        statusCode:200
      },
    });
  }
}

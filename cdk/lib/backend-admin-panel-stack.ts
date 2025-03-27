import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ecr from 'aws-cdk-lib/aws-ecr';  
import { ConfigService } from '@nestjs/config';

export class BackendAdminPanelStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, private readonly configService?:ConfigService) {
    super(scope, id, props);

      let environmentVariables;
      if(configService){
        environmentVariables = {
          DATABASE_HOST:configService.get('DATABASE_HOST'), 
          DATABASE_PORT: configService.get('DATABASE_PORT'),
          DATABASE_USER: configService.get('DATABASE_USER'),
          DATABASE_PASSWORD: configService.get('DATABASE_PASSWORD'),
          DATABASE_NAME: configService.get('DATABASE_NAME'),
          CLIENT_ID:configService.get('CLIENT_ID'),
          CLIENT_SECRET:configService.get('CLIENT_SECRET'),
          NODE_ENV:configService.get('NODE_ENV')
        };
        console.log("environmentVariables:",environmentVariables)
      }

       // Reference the existing ECR repository
       const repository = ecr.Repository.fromRepositoryAttributes(this, 'BackendAdminPanelRepository', {
        repositoryName: 'admin-panel-python-repo',  
        repositoryArn: `arn:aws:ecr:us-east-1:722365352638:repository/admin-panel-python-repo`,
      });

      const fastApiLambda = new lambda.DockerImageFunction(this, 'BackendAdminPanelLambda', {
        code: lambda.DockerImageCode.fromEcr(repository, {
          tagOrDigest: 'latest',  
        }),
      memorySize: 512,    
      timeout: cdk.Duration.seconds(30),
    });

     
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

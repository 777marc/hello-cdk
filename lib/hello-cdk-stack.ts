import * as cdk from "aws-cdk-lib";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import * as path from "path";
import * as ecrdeploy from "cdk-ecr-deployment";

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repo_ = new cdk.aws_ecr.Repository(this, "sample node app", {
      repositoryName: "sample-node-app",
    });

    const image = new DockerImageAsset(this, "sample-node-app-img", {
      // Put the directory where your Dockerfile is below
      directory: path.join(__dirname, "../apps/nextjs-app"),
      invalidation: {
        buildArgs: false,
      },
    });

    new ecrdeploy.ECRDeployment(this, "DeployDockerImage", {
      src: new ecrdeploy.DockerImageName(image.imageUri),
      dest: new ecrdeploy.DockerImageName(`${repo_.repositoryUri}:latest`),
    });
  }
}

import * as cdk from "aws-cdk-lib";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import * as path from "path";
import * as ecrdeploy from "cdk-ecr-deployment";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repo_ = new cdk.aws_ecr.Repository(this, "sample react app", {
      repositoryName: "sample-react-app",
    });

    const image = new DockerImageAsset(this, "sample-react-app-img", {
      // Put the directory where your Dockerfile is below
      directory: path.join(__dirname, "../apps/react-app"),
      invalidation: {
        buildArgs: false,
      },
    });

    new ecrdeploy.ECRDeployment(this, "DeployDockerImage", {
      src: new ecrdeploy.DockerImageName(image.imageUri),
      dest: new ecrdeploy.DockerImageName(`${repo_.repositoryUri}:latest`),
    });

    // const defaultVpc = ec2.Vpc.fromLookup(this, "default", {
    //   vpcName: "default",
    // });

    new cdk.aws_ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "Service",
      {
        memoryLimitMiB: 1024,
        desiredCount: 2,
        cpu: 512,
        // vpc: defaultVpc,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry(
            "388414971737.dkr.ecr.us-east-1.amazonaws.com/sample-react-app:latest"
          ),
        },
        taskSubnets: {
          subnets: [
            ec2.Subnet.fromSubnetId(
              this,
              "us-east-1a",
              "subnet-01db51d0d61291d6c"
            ),
            ec2.Subnet.fromSubnetId(
              this,
              "us-east-1b",
              "subnet-0f867a504bd6bde72"
            ),
          ],
        },
        loadBalancerName: "cdk-lb",
      }
    );
  }
}

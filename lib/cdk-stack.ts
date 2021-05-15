import * as cdk from '@aws-cdk/core';
import * as apig from '@aws-cdk/aws-apigatewayv2';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as task from '@aws-cdk/aws-stepfunctions-tasks';
import { HttpProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { Duration } from '@aws-cdk/core';

export class CdkStack extends cdk.Stack {
  api: HttpApi;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const spacetraders = new HttpProxyIntegration({
      url: 'https://api.spacetraders.io'
    })

    this.api = new HttpApi(this, 'SpaceTradersProxy');
    this.api.addRoutes({
      path: "/{proxy+}",
      integration: spacetraders
    })

    const waitX = new sfn.Wait(this, 'waitSeconds', {
      time: sfn.WaitTime.duration(cdk.Duration.seconds(30))
    })

    const success = new sfn.Pass(this, 'Success')
    const failed = new sfn.Fail(this, 'Failed', {
      cause: 'TOTAL FAILURE',
      error: 'Everything failed'
    })
    // The code that defines your stack goes here
    const getGameStatus = this.apiCall('/game/status');
    const getPlayerShips = this.apiCall('/user/ships');
    const definition = getGameStatus
      .next(
        new sfn.Choice(this, 'Online?')
          .when(sfn.Condition.stringMatches('$.status', '*online*'), success)
          .otherwise(waitX.next(getGameStatus))
      )
      
    new sfn.StateMachine(this, 'ShipLoop', {
      definition,
      timeout: Duration.minutes(3)
    })
  }

  apiCall(apiPath: string, method: task.HttpMethod = task.HttpMethod.GET){
    return new task.CallApiGatewayHttpApiEndpoint(this, `${apiPath.split('/').join('')}`, {
      apiId: this.api.apiId,
      apiStack: this.api.stack,
      method,
      apiPath,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
}

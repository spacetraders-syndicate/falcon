import * as cdk from '@aws-cdk/core';
import * as apig from '@aws-cdk/aws-apigatewayv2';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as task from '@aws-cdk/aws-stepfunctions-tasks';
import { CfnApi, HttpApi, HttpIntegrationType, HttpMethod, HttpRoute, HttpRouteKey } from '@aws-cdk/aws-apigatewayv2';
import { Duration } from '@aws-cdk/core';
import { CallApi } from './call-api';

export class CdkStack extends cdk.Stack {
  api: CfnApi;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this._configureSpaceTradersProxy();

    const waitX = new sfn.Wait(this, 'waitSeconds', {
      time: sfn.WaitTime.duration(cdk.Duration.seconds(30))
    })

    const success = new sfn.Pass(this, 'Success')

  
    // The code that defines your stack goes here
    const getGameStatus = new CallApi(this, 'GetGameStatus', {
      api: this.api,
      extractor: "$.ResponseBody.status",
      path: '/game/status'
    });

    const definition = getGameStatus
      .next(
        new sfn.Choice(this, 'Online?')
          .when(sfn.Condition.stringMatches('$', '*online*'), success)
          .otherwise(waitX.next(getGameStatus))
      )

    new sfn.StateMachine(this, 'ShipLoop', {
      definition,
      timeout: Duration.minutes(3)
    })
  }

  _configureSpaceTradersProxy() {
    this.api = new CfnApi(this, 'SpaceTradersIoProxy', {
      name: 'SpaceTradersProxy',
      protocolType: 'HTTP'
    });

    const spacetraders = new apig.CfnIntegration(this, "SpaceTradersHttpIntegration", {
      apiId: this.api.ref,
      integrationUri: 'https://api.spacetraders.io',
      integrationType: HttpIntegrationType.HTTP_PROXY,
      integrationMethod: HttpMethod.ANY,
      requestParameters: {
        "overwrite:path": "$request.path"
      },
      payloadFormatVersion: '1.0'
    })

    const route = new apig.CfnRoute(this, 'SpaceTradersIntegrationRoute', {
      apiId: this.api.ref,
      routeKey: '$default',
      target: `integrations/${spacetraders.ref}`,
    })

    const stage = new apig.CfnStage(this, 'SpaceTradersApiStage', {
      apiId: this.api.ref,
      autoDeploy: true,
      stageName: '$default'
    })
  }
}

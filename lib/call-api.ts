import * as cdk from '@aws-cdk/core';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as task from '@aws-cdk/aws-stepfunctions-tasks';
import { HttpMethod } from '@aws-cdk/aws-stepfunctions-tasks';
import { CfnApi } from '@aws-cdk/aws-apigatewayv2';

interface CallApiProps {
    api: CfnApi;
    path: string;
    extractor: string;
    method?: HttpMethod;
}

export class CallApi extends sfn.StateMachineFragment {
    public readonly startState: sfn.State;
    public readonly endStates: sfn.INextable[];

    constructor(parent: cdk.Construct, id: string, props: CallApiProps) {
        super(parent, id);
        
        const first = new task.CallApiGatewayHttpApiEndpoint(this, `${id}Request`, {
            apiId: props.api.ref,
            apiStack: props.api.stack,
            method: props.method || HttpMethod.GET,
            apiPath: props.path
          })

        const failed = new sfn.Fail(this, `${id}UnrecoverableHttpError`, {
            cause: 'TOTAL FAILURE',
            error: 'Everything failed'
        })

        const success = new sfn.Pass(this, `${id}MapState`, {
            outputPath: props.extractor
        })
        const retry = new sfn.Wait(this, `${id}RetryWait`, {
            time: sfn.WaitTime.secondsPath("$.Headers['retry-after']")
        }).next(first);

        const choice = new sfn.Choice(this, `${id}Retry?`)
            .when(sfn.Condition.numberEquals("$.StatusCode", 429), retry)
            .when(sfn.Condition.isPresent(props.extractor), success)
            .otherwise(failed)      

        first.next(choice);

        this.startState = first;
        this.endStates = [success];
    }
}



// apiCall(apiPath: string, method: task.HttpMethod = task.HttpMethod.GET) {
//     const request = new task.CallApiGatewayHttpApiEndpoint(this, `${apiPath.split('/').join('')}`, {
//       apiId: this.api.ref,
//       apiStack: this.api.stack,
//       method,
//       apiPath
//     })
    
//     const waitRetryTime = new sfn.Wait(this, 'waitRetryTime', {
//       time: sfn.WaitTime.secondsPath("$.Headers.retry-after")
//     })

//     return request.next(
//       new sfn.Choice(
//         this,
//         "Retry?",
//       )
//         .when(sfn.Condition.numberEquals("$.StatusCode", 429), waitRetryTime)
//     )
//   }
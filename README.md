# Amplify SNS=>SQS trigger with lambda template

<p>
  <a href="https://www.npmjs.com/package/amplify-sns-sqs-lambda-template">
      <img src="https://img.shields.io/npm/v/amplify-sns-sqs-lambda-template.svg" />
  </a>
</p>

An easy way to add CloudFormation SNS=>SQS trigger lambda templates to your Amplify Project.

## Installation

This plugin assumes that the Amplify CLI is already installed. For installation help, please see step 2 of the [getting-started docs](https://aws-amplify.github.io/docs/).

To install, simply enter the following command in your terminal:

`npm i -g amplify-sns-sqs-lambda-template`

## Usage

| Command                      | Description |
| ---------------------------- | ----------- |
| `amplify add sns-sqs-function`       | Adds an SNS-SQS trigger template to your project. |
| `amplify remove sns-sqs-function`    | Removes a specified SNS-SQS trigger template from your project. |

## Usage notes

Note that you can apply this template on an existing function generated via amplify.

The resource will assume the function codes can be found in `./src` relative to the template, such as in `./src/index.js` for nodejs lambda code.

## SQS usage

You can use the [sqs-utils](https://github.com/hogarthww-labs/sqs-utils) module to facilitate working with SQS, including [Producer](https://www.npmjs.com/package/sqs-producer) and [Consumer](https://www.npmjs.com/package/sqs-consumer).

## Users groups and policies

The CLI will ask if you want to add an SNS Consumer and an SNS Producer

For the SNS Producer it will ask to add

- `PublishUserPolicy`
- `PublishGroupPolicy`
- `PublishUser`

For the SNS Consumer it will ask to add

The SNS Consumer is an SQS queue that can be linked to a Lambda that is triggered on each message on the queue.

The Publish User is generated with an empty login profile that you will have to fill in manually.

```json
  "MyPublishUser": {
    "Type": "AWS::IAM::User",
    "Properties": {
      "LoginProfile": {
      }
    }
  },
```

At a minimum add a password. See [IAM user guide](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-iam.html) for more details.

```json
"LoginProfile" : {
    "Password" : "myP@ssW0rd"
},
```

### Policies

You have the option to add

- publish user policy which allows a user to publish messages to SNS
- publish group policy which allows members of that group to publish to SNS
- consumer user policy which allows a user to receive messages from SQS queue
- consumer group policy which allows members of that group to delete or receive messages from the SQS consumer queue

## User roles

As an alternative create an user role to publish SNS messages. Then any user with that role can publish.

You can also add a user role to consume SQS messages on the SQS consumer queue (linked to the SNS topic).

## Managing access to SQS queues

There are two ways to give your users permissions to your Amazon SQS queues: using the Amazon SQS policy system and using the IAM policy system. You can use either system, or both, to attach policies to users or roles. In most cases, you can achieve the same result using either system.

### Resources

- [IAM Identities (users, groups, and roles)](https://docs.aws.amazon.com/IAM/latest/UserGuide/id.html)
- [Using identity-based policies with Amazon SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-using-identity-based-policies.html)
- [Overview of managing access in Amazon SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-overview-of-managing-access.html)
- [Basic examples of IAM policies for Amazon SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-basic-examples-of-iam-policies.html)

## Runtimes

[Lambda runtime values](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html)

```txt
dotnetcore1.0 | dotnetcore2.0 | dotnetcore2.1 | dotnetcore3.1 | go1.x | java11 | java8 | java8.al2 | nodejs | nodejs10.x | nodejs12.x | nodejs4.3 | nodejs4.3-edge | nodejs6.10 | nodejs8.10 | provided | provided.al2 | python2.7 | python3.6 | python3.7 | python3.8 | ruby2.5 | ruby2.7
```

Currently the CLI only supports the following values:

- `nodejs12.x`
- `python3.8`
- `python3.7`
- `python2.7`

You can manually edit the generated template, searching for runtime and substitute as needed.

## Timeout

You can specify the timeout for the lambda. The default is `60` for 60 seconds (1 minute)

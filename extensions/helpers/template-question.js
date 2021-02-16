const questions = require('./questions.json');
const inquirer = require('inquirer');
const fs = require('fs');

const questionNames = questions.map(q => q.name)

async function subscribeToExistingSnsTopic(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    let index = questionNames.indexOf('snsSubscription')
    let input = inputs[index]
    let questions = [
        {
          type: input.type,
          name: 'snsSubscription',
          message: input.question,
          validate: amplify.inputValidation(input),
          default: input.default,
    }];

    let answers
    answers = await inquirer.prompt(askSubscribeToExistingSnsTopic);
    let { snsSubscription } = answers
    if (!snsSubscription) {
        return {
            addSnsSubscription: snsSubscription
        }
    }
    let index = questionNames.indexOf('snsTopicArn')
    let input = inputs[index]
    questions = [
        {
          type: input.type,
          name: 'snsTopicArn',
          message: input.question,
          validate: amplify.inputValidation(input),
          default: input.default,
    }];

    answers = await inquirer.prompt(questions); 
    let { topicArn } = answers
    return {
        addSnsSubscription: snsSubscription,
        snsTopicArn
    }
}

async function createNewSnsTopic(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    let index = questionNames.indexOf('createSNSTopic')
    let input = inputs[index]
    let questions = [
        {
          type: input.type,
          name: 'createSNSTopic',
          message: input.question,
          validate: amplify.inputValidation(input),
          default: input.default,
    }];
    let answers
    answers = await inquirer.prompt(questions);
    let { createSNSTopic } = answers[inputs[2].name]
    if (!createSNSTopic) {
        return {
            addNewSnsTopic: createSNSTopic
        }
    }
    let index = questionNames.indexOf('snsTopicName')
    let input = inputs[index]
    questions = [
        {
          type: input.type,
          name: input.name,
          message: input.question,
          validate: amplify.inputValidation(input),
          default: input.default,
    }];

    answers = await inquirer.prompt(questions); 
    let { snsTopicName } = answers
    return {
        addNewSnsTopic: createSNSTopic,
        snsTopicName
    }
}

async function getSNSProducerDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    let index = questionNames.indexOf('addSnsProducer')
    let input = inputs[index]

    const questions = [
        {
            type: inputs.type,
            name: 'addSnsProducer',
            message: inputs.question,
            validate: amplify.inputValidation(inputs),
            default: 'producer',
        }
    ];

    let answers = await inquirer.prompt(questions);
    const { addSnsProducer } = answers

    if (!addSnsProducer) {
        return answers
    }

    let index = questionNames.indexOf('snsProducerName')
    let input = inputs[index]
    const questions = [
        {
            type: input.type,
            name: 'snsProducerName',
            message: input.question,
            validate: amplify.inputValidation(input),
            default: 'producer',
        }
    ];

    let producerDetails = await inquirer.prompt(questions);
    return {
        ...producerDetails,
        addSnsProducer
    }

}

async function getSNSConsumerDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    let index = questionNames.indexOf('addSnsConsumer')
    let input = inputs[index]

    let questions = [
        {
            type: input.type,
            name: 'addSnsConsumer',
            message: input.question,
            validate: amplify.inputValidation(input),
            default: 'consumer',
        }
    ];

    let answers = await inquirer.prompt(questions);
    const { addSnsConsumer } = answers

    if (!addSnsConsumer) {
        return answers
    }
    let index = questionNames.indexOf('snsConsumerName')
    let input = inputs[index]
    questions = [
        {
            type: input.type,
            name: 'snsConsumerName',
            message: input.question,
            validate: amplify.inputValidation(input),
            default: 'consumer',
        }
    ];

    let consumerDetails = await inquirer.prompt(questions);
    return {
        ...consumerDetails,
        addSnsConsumer
    }
}

async function getConsumerPolicyDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;

    addConsumeSQSUserRole

    let index = questionNames.indexOf('addConsumeSQSUserRole')
    let input = inputs[index]
    let questions = [
        {
            type: inputs.type,
            name: 'addConsumerUserPolicy',
            message: inputs.question,
            validate: amplify.inputValidation(input),
            default: false,
        }
    ]
    
    let answers = await inquirer.prompt(questions);
    let { addConsumeSQSUserRole } = answers
    if (!addConsumeSQSUserRole) {
        return answers
    }    

    let index = questionNames.indexOf('addConsumerUserPolicy')
    let input = inputs[index]
    let questions = [
        {
            type: inputs.type,
            name: 'addConsumerUserPolicy',
            message: inputs.question,
            validate: amplify.inputValidation(input),
            default: false,
        }
    ]

    let answers = await inquirer.prompt(questions);
    let { addConsumerUserPolicy } = answers
    if (!addConsumerUserPolicy) {
        return {
            addConsumeSQSUserRole,
            ...answers
        }
    }    
    let index = questionNames.indexOf('addConsumerGroupPolicy')
    let input = inputs[index]    
    questions = [
        {
            type: input.type,
            name: 'addConsumerGroupPolicy',
            message: input.question,
            validate: amplify.inputValidation(input),
            default: false,
        }
    ]

    let answers = await inquirer.prompt(questions);
    let { addConsumerGroupPolicy } = answers

    if (!addConsumerGroupPolicy) {
        return {
            addConsumeSQSUserRole,
            addConsumerUserPolicy,
            addConsumerGroupPolicy
        }
    }    
    let index = questionNames.indexOf('addConsumerUser')
    let input = inputs[index]    
    let questions = [{
            type: input.type,
            name: 'addConsumerUser',
            message: input.question,
            validate: amplify.inputValidation(input),
            default: false,
        }
    ];

    let answers = await inquirer.prompt(questions);
    return {
        ...answers,
        addConsumeSQSUserRole,
        addConsumerUserPolicy,
        addConsumerGroupPolicy,
    }
}

async function getProducerPolicyDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;

    let index = questionNames.indexOf('addPublishSnsUserRole')
    let input = inputs[index]
    let questions = [
        {
            type: inputs.type,
            name: 'addPublishSnsUserRole',
            message: inputs.question,
            validate: amplify.inputValidation(input),
            default: false,
        }
    ]

    let answers = await inquirer.prompt(questions);
    let { addPublishSnsUserRole } = answers

    if (!addPublishSnsUserRole) {
        return answers
    }
    
    let index = questionNames.indexOf('addPublishUserPolicy')
    let input = inputs[index]    
    let questions = [
        {
            type: input.type,
            name: 'addPublishUserPolicy',
            message: input.question,
            validate: amplify.inputValidation(input),
            default: false,
        }
    ]

    let answers = await inquirer.prompt(questions);
    let { addPublishUserPolicy } = answers

    if (!addPublishUserPolicy) {
        return {
            addPublishSnsUserRole,
            ...answers
        }
    }
    let index = questionNames.indexOf('addPublishGroupPolicy')
    let input = inputs[index]    
    questions = [
        {
            type: input.type,
            name: 'addPublishGroupPolicy',
            message: input.question,
            validate: amplify.inputValidation(input),
            default: false,
        }
    ]

    let answers = await inquirer.prompt(questions);
    let { addPublishGroupPolicy } = answers

    if (!addPublishGroupPolicy) {
        return {
            addPublishSnsUserRole,
            addPublishUserPolicy,
            addPublishGroupPolicy
        }
    }
    let index = questionNames.indexOf('addPublishUser')
    let input = inputs[index]    
    questions = [ 
        {
            type: input.type,
            name: 'addPublishUser',
            message: input.question,
            validate: amplify.inputValidation(input),
            default: false,
        }
    ];

    let answers = await inquirer.prompt(questions);
    return {
        ...answers,
        addPublishSnsUserRole,
        addPublishUserPolicy,
        addPublishGroupPolicy
    };
}

async function getLambdaDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    let index = questionNames.indexOf('addConsumerLambda')
    let input = inputs[index]    
    const questions = [
        {
          type: inputs.type,
          name: 'addConsumerLambda',
          message: inputs.question,
          validate: amplify.inputValidation(input),
          default: 'consumer',
    }];
    let answers = await inquirer.prompt(questions);
    let { addConsumerLambda } = answers

    if (!addConsumerLambda) {
        return {
            addConsumerLambda,
        }
    }

    let index = questionNames.indexOf('lambdaName')
    let input = inputs[index]    
    const lambdaQ = {
          type: inputs.type,
          name: 'lambdaName',
          message: inputs.question,
          validate: amplify.inputValidation(input),
          default: 'consumer',
    };
    
    let index = questionNames.indexOf('runtime')
    let input = inputs[index]    
    const runtimeQ = {
          type: inputs.type,
          name: 'runtime',
          message: inputs.question,
          validate: amplify.inputValidation(input),
          default: 'nodejs12.x',
    };

    const questions = [lambdaQ, runtimeQ]    

    answers = await inquirer.prompt(questions);
    return {
        ...answers,
        addConsumerLambda
    };
}

async function generateQuestions(context, rootTemplate){
    const { amplify } = context;
    let questions = []

    Object.keys(rootTemplate.Parameters).forEach(key => {
        if (key === "env") return;
        let question = {};
        let param = rootTemplate.Parameters[key];
        question.name = key;
        question.message = `${param.Description}`;
        question.default = (param.Default != undefined) ? param.Default : "";
        if (param.Type === "String" && param.AllowedPattern != undefined){
            let regex = param.AllowedPattern;
            question.type = "input";
            question.validation = {};
            question.validation.operator = "regex";
            
            let lengthRegex = "";
            if (param.MinLength != undefined || param.MaxLength != undefined ){
                lengthRegex = ((param.MinLength != undefined) ? `{${param.MinLength},` : "{,") + ((param.MaxLength != undefined) ? `${param.MaxLength}}` : "}");
                if (param.MaxLength == param.MinLength){
                    lengthRegex = `{${param.MaxLength}}`
                }
                if (regex[regex.length-1] === '*'){
                     regex = regex.slice(0,-1);
                }
            }
            question.validation.value = `^${regex}` + ((lengthRegex != "") ? lengthRegex : "") + "$";
            question.validation.onErrorMesg = param.ConstraintDescription;
            question.validate = amplify.inputValidation(question);
            questions.push(question);
        } else if ((param.Type === "String" || param.Type === "Number") && param.AllowedValues != undefined){
            question.type = "list";
            question.choices = param.AllowedValues;
            questions.push(question);
        } else if (param.Type === "Number"){
            question.type = "number";
            question.validation = {};
            question.validation.operator = "range";
            question.validation.value = {};
            question.validation.value.min = ((param.MinValue != undefined) ? param.MinValue : Number.NEGATIVE_INFINITY);
            question.validation.value.max = ((param.MaxValue != undefined) ? param.MaxValue : Number.POSITIVE_INFINITY);
            question.validation.onErrorMesg = param.ConstraintDescription;
            question.validate = amplify.inputValidation(question);
            questions.push(question);
        } else {
            //Ignore and keep default :)
        }
        
    });

    const answers = await inquirer.prompt(questions);

    Object.keys(answers).forEach(key => {
        rootTemplate.Parameters[key].Default = answers[key];
    });
    return rootTemplate;
}

module.exports = {
    generateQuestions,
    subscribeToExistingSnsTopic,
    createNewSnsTopic,
    getSNSProducerDetails,
    getSNSConsumerDetails,
    getConsumerPolicyDetails,
    getProducerPolicyDetails,
    getLambdaDetails
}
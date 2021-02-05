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
    let index = questionNames.indexOf('topicArnName')
    let input = inputs[index]
    questions = [
        {
          type: input.type,
          name: 'topicArnName',
          message: input.question,
          validate: amplify.inputValidation(input),
          default: input.default,
    }];

    answers = await inquirer.prompt(questions); 
    let { topicArn } = answers
    return {
        addSnsSubscription: snsSubscription,
        topicArn
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
    let index = questionNames.indexOf(topicName)
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
    let { topicName } = answers
    return {
        addNewSnsTopic: createSNSTopic,
        topicName
    }
}

async function getSNSProducerDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    const questions = [
        {
            type: inputs[1].type,
            name: 'addSnSProducer',
            message: inputs[1].question,
            validate: amplify.inputValidation(inputs[1]),
            default: 'producer',
        }
    ];

    let answers = await inquirer.prompt(questions);
    const { addSnSProducer } = answers

    if (!addSnSProducer) {
        return answers
    }

    const questions = [
        {
            type: inputs[1].type,
            name: 'producerName',
            message: inputs[1].question,
            validate: amplify.inputValidation(inputs[1]),
            default: 'producer',
        }
    ];

    let producerDetails = await inquirer.prompt(questions);
    return {
        ...producerDetails,
        addSnSProducer
    }

}

async function getSNSConsumerDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;

    let questions = [
        {
            type: inputs[1].type,
            name: 'addSnsConsumer',
            message: inputs[1].question,
            validate: amplify.inputValidation(inputs[1]),
            default: 'consumer',
        }
    ];

    let answers = await inquirer.prompt(questions);
    const { addSnsConsumer } = answers

    if (!addSnsConsumer) {
        return answers
    }

    questions = [
        {
            type: inputs[2].type,
            name: 'consumerName',
            message: inputs[2].question,
            validate: amplify.inputValidation(inputs[2]),
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
    let questions = [
        {
            type: inputs[1].type,
            name: 'addConsumerUserPolicy',
            message: inputs[1].question,
            validate: amplify.inputValidation(inputs[1]),
            default: false,
        }
    ]

    let answers = await inquirer.prompt(questions);
    let { addConsumerUserPolicy } = answers
    if (!addConsumerUserPolicy) {
        return answers
    }    
    questions = [
        {
            type: inputs[2].type,
            name: 'addConsumerGroupPolicy',
            message: inputs[2].question,
            validate: amplify.inputValidation(inputs[2]),
            default: false,
        }
    ]

    let answers = await inquirer.prompt(questions);
    let { addConsumerGroupPolicy } = answers

    if (!addConsumerGroupPolicy) {
        return {
            addConsumerUserPolicy,
            addConsumerGroupPolicy
        }
    }    

    let questions = [{
            type: inputs[2].type,
            name: 'addConsumerUser',
            message: inputs[2].question,
            validate: amplify.inputValidation(inputs[2]),
            default: false,
        }
    ];

    let answers = await inquirer.prompt(questions);
    return {
        ...answers,
        addConsumerUserPolicy,
        addConsumerGroupPolicy,
    }
}

async function getProducerPolicyDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    let questions = [
        {
            type: inputs[1].type,
            name: 'addPublishUserPolicy',
            message: inputs[1].question,
            validate: amplify.inputValidation(inputs[1]),
            default: false,
        }
    ]

    let answers = await inquirer.prompt(questions);
    let { addPublishUserPolicy } = answers

    if (!addPublishUserPolicy) {
        return answers
    }

    questions = [
        {
            type: inputs[2].type,
            name: 'addPublishGroupPolicy',
            message: inputs[2].question,
            validate: amplify.inputValidation(inputs[2]),
            default: false,
        }
    ]

    let answers = await inquirer.prompt(questions);
    let { addPublishGroupPolicy } = answers

    if (!addPublishGroupPolicy) {
        return {
            addPublishUserPolicy,
            addPublishGroupPolicy
        }
    }

    questions = [ 
        {
            type: inputs[2].type,
            name: 'addPublishUser',
            message: inputs[2].question,
            validate: amplify.inputValidation(inputs[2]),
            default: false,
        }
    ];

    let answers = await inquirer.prompt(questions);
    return {
        ...answers,
        addPublishUserPolicy,
        addPublishGroupPolicy
    };
}

async function getLambdaDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    const index  = 3
    const input = inputs[index]
    const lambdaQuestions = [
        {
          type: inputs.type,
          name: inputs.key,
          message: inputs.question,
          validate: amplify.inputValidation(input),
          default: 'consumer',
    }];

    return await inquirer.prompt(lambdaQuestions);
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
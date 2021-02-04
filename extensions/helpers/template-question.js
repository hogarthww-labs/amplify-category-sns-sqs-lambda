const questions = require('./questions.json');
const inquirer = require('inquirer');
const fs = require('fs');

async function getSNSDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    const nameProject = [
        {
          type: inputs[0].type,
          name: 'topicName',
          message: inputs[0].question,
          validate: amplify.inputValidation(inputs[0]),
          default: 'MySNStopic',
    }];

    let resource = await inquirer.prompt(nameProject);

    return resource.name;
}

async function getSQSDetails(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    const sqsQuestions = [
        {
            type: inputs[1].type,
            name: 'producerName',
            message: inputs[1].question,
            validate: amplify.inputValidation(inputs[1]),
            default: 'producer',
        },
        {
            type: inputs[2].type,
            name: 'consumerName',
            message: inputs[2].question,
            validate: amplify.inputValidation(inputs[2]),
            default: 'consumer',
        }
    ];

    let sqsDetails = await inquirer.prompt(sqsQuestions);
    return sqsDetails;
}

async function getLambdaName(context){
    const { amplify } = context;
    const inputs = questions.template.inputs;
    const index  = 3
    const input = inputs[index]
    const nameLambda = [
        {
          type: inputs.type,
          name: inputs.key,
          message: inputs.question,
          validate: amplify.inputValidation(input),
          default: amplify.getProjectDetails().projectConfig.projectName,
    }];

    let resource = await inquirer.prompt(nameLambda);

    return resource.name;
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
    getProjectName,
    generateQuestions,
    getSQSDetails,
    getSNSDetails,
    getLambdaName
}
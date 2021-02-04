const fs = require('fs');
const path = require('path');
const { copyFilesToS3 } = require('./helpers/template-staging');
const { getProjectName, generateQuestions, getLambdaName, getSNSDetails, getSQSDetails } = require('./helpers/template-question');
const { yamlParse, yamlDump } = require('yaml-cfn');

module.exports = (context) => {
    context.createTemplate = async () => {
      await createTemplate(context);
    };
};

async function createTemplate(context){
    const options = {
        service: 'sqs',
        providerPlugin: 'awscloudformation',
    };

    let lambdaName = await getLambdaName(context);
    let snsDetails = await getSNSDetails(context);    
    let sqsDetails = await getSQSDetails(context);    
    let props = {}
    props.lambdaName = lambdaName;
    props.snsDetails = snsDetails;
    props.sqsDetails = sqsDetails;
    props.options = options;
    props.root = path.join(__dirname, 'templates/sns-sqs-lambda-template.json')
    prepareCloudFormation(context,props);
}

async function prepareCloudFormation(context, props){
    let split = props.root.split('.');
    let ending = split[split.length-1];
    props.ending = ending
    if (ending.toLowerCase() === 'json'){
        await handleJSON(context, props);
    } else if (ending.toLowerCase() === 'yaml' || ending.toLowerCase() === 'yml'){
        await handleYAML(context, props);
    } else {
        console.log('Error! Can\'t find ending');
    }
    await stageRoot(context, props);
}

function replaceTemplateName(rootTemplate, props) {
    rootTemplate = rootTemplate.replace('<sns-topic-name>', props.snsDetails.topicName)
    rootTemplate = rootTemplate.replace('<sqs-consumer>', props.sqsDetails.consumerName)
    rootTemplate = rootTemplate.replace('<sqs-producer>', props.sqsDetails.producerName)
    rootTemplate = rootTemplate.replace('<lambda-name>', props.lambdaName)
    return rootTemplate    
}


async function handleYAML(context, props){
    let rootTemplate = yamlParse(fs.readFileSync(props.root,'utf8'));
    rootTemplate = await prepareTemplate(context, props, rootTemplate);
    rootTemplate = replaceTemplateName(rootTemplate, props)
    rootTemplate = await generateQuestions(context, rootTemplate);
    fs.writeFileSync(props.root, yamlDump(rootTemplate, null, 4));
}

async function handleJSON(context, props){
    let rootTemplate = JSON.parse(fs.readFileSync(props.root));
    rootTemplate = await prepareTemplate(context, props, rootTemplate);
    rootTemplate = replaceTemplateName(rootTemplate, props)
    rootTemplate = await generateQuestions(context, rootTemplate);
    fs.writeFileSync(props.root, JSON.stringify(rootTemplate, null, 4));
}

async function prepareTemplate(context, props, rootTemplate){
    const { amplify } = context;

    if (!rootTemplate.Parameters){
        rootTemplate.Parameters = {}
    } 
    if (!rootTemplate.Parameters.env) {
        rootTemplate.Parameters.env = {
            Type :"String",
            Description: "The environment name. e.g. Dev, Test, or Production",
            Default: "NONE"
        }
    }
    return rootTemplate
}

async function stageRoot(context, props){
    const { amplify } = context;
    const targetDir = amplify.pathManager.getBackendDirPath();
    const copyJobs = [
        {
          dir: '/',
          template: `${props.root}`,
          target: `${targetDir}/function/${props.projectName}/${props.projectName}-sns-sqs-template.${props.ending}`,
        },
      ];
      context.amplify.updateamplifyMetaAfterResourceAdd(
        "sqs",
        props.projectName,
        props.options,
      );
      await context.amplify.copyBatch(context, copyJobs, props);      
}
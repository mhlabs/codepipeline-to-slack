function formatPipeline(pipeline, stages) {
  let slackString = `_${pipeline.Status}_: <https://${process.env.AWS_REGION}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipeline.Pipeline}/view?region=${process.env.AWS_REGION}|${pipeline.Pipeline}>\n`;
  let i = 0;
  for (const stage of stages) {
    i++;

    stage.Status = stage.Status || "UNKNOWN";
    if (i > 1) slackString += " | ";
    slackString += `${stage.TypeId}: `;
    slackString += process.env[`Emoji${stage.Status}`];
  }
  return slackString;
}

function successfulPipeline(pipeline) {
  let slackString =
    `${process.env[`EmojiSUCCEEDED`]} *${pipeline}*`;

    return slackString;
}

module.exports = {
  formatPipeline,
  successfulPipeline,
};

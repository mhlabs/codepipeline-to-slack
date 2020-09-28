const AWS = require("aws-sdk");
const { Execution } = require("./db/Execution");
const { WebClient } = require("@slack/web-api");
const SlackUtil = require("./SlackUtil");
const token = process.env.SlackToken;
const web = new WebClient(token);

exports.handler = async (event) => {
  await Execution.put({
    Pipeline: event.pipeline,
    ExecutionId: event["execution-id"],
    Type: "PIPELINE",
    Status: event.state,
    TypeId: "state",
  });
  if (event.state === "SUCCEEDED") {
    const slack = await Execution.query(event["execution-id"], {
      beginsWith: "SLACK#",
    });

    await web.chat.update({
      channel: slack.Items[0].ChannelId,
      text: "Pipeline Succeeded",
      ts: slack.Items[0].TypeId,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: SlackUtil.successfulPipeline(event.pipeline),
          },
        },
      ],
    });
  }
};

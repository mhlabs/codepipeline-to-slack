const AWS = require("aws-sdk");
const { Execution } = require("./db/Execution");
const { WebClient } = require("@slack/web-api");
const SlackUtil = require("./SlackUtil");
const token = process.env.SlackToken;
const web = new WebClient(token);

exports.handler = async (event) => {
  for (const record of event.Records) {
    const oldImage = AWS.DynamoDB.Converter.unmarshall(
      record.dynamodb.OldImage
    );
    const newImage = AWS.DynamoDB.Converter.unmarshall(
      record.dynamodb.NewImage
    );

    if (oldImage.Status != newImage.Status) {
      const pipeline = await Execution.get({
        PK: newImage.PK,
        SK: "PIPELINE#state",
      });
      if (pipeline.Item.Status === "SUCCEEDED") {
        console.log("SUCCESS");
        return;
      }
      const stages = await Execution.query(newImage.PK, {
        beginsWith: "STAGE#",
      });
      const slack = await Execution.query(newImage.PK, {
        beginsWith: "SLACK#",
      });

      if (!stages.Items[0].Order || !slack.Items[0]) {
        return;
      }
      stages.Items = stages.Items.sort((a, b) =>
        a.Order > b.Order ? 1 : b.Order > a.Order ? -1 : 0
      );
      for (let i = stages.Items.length - 2; i >= 0; i--) {
        console.log("x", stages.Items[i + 1]);
        if (stages.Items[i + 1].Status) {
          stages.Items[i].Status = "SUCCEEDED"; // sometimes the STARTED event gets emitted _after_ other states
          await Execution.update(stages.Items[i]);
        }
      }
      
      const slackString = SlackUtil.formatPipeline(pipeline.Item, stages.Items);
      await web.chat.update({
        channel: slack.Items[0].ChannelId,
        text: "test",
        ts: slack.Items[0].TypeId,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: slackString,
            },
          },
        ],
      });
    }
  }
};

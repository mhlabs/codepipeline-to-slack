const AWS = require("aws-sdk");
const codePipeline = new AWS.CodePipeline();
const { Execution } = require("./db/Execution");
const { ExecutionTable } = require("./db/Table");
const { WebClient } = require("@slack/web-api");
const token = process.env.SlackToken;
const web = new WebClient(token);

exports.handler = async (event) => {
  const pipeline = await codePipeline
    .getPipeline({ name: event.pipeline })
    .promise();    

  const post = await web.chat.postMessage({
    channel: process.env.SlackChannel,
    text: `_Starting_: *${event.pipeline}*`,
  });
  console.log(JSON.stringify(post, null, 2));

  const puts = [];
  puts.push(
    Execution.putBatch({
      Pipeline: event.pipeline,
      ExecutionId: event["execution-id"],
      Type: "SLACK",
      TypeId: post.ts,
      ChannelId: post.channel,
    }),
    Execution.putBatch({
      Pipeline: event.pipeline,
      ExecutionId: event["execution-id"],
      Type: "PIPELINE",
      Status: event.state,
      TypeId: "state",
    })
  );
  await ExecutionTable.batchWrite(puts);

  let runOrder = 0;
  for (const stage of pipeline.pipeline.stages) {
    runOrder++;
    await Execution.update({
      Pipeline: event.pipeline,
      ExecutionId: event["execution-id"],
      Type: "STAGE",
      TypeId: stage.name,
      Order: runOrder,
    });
  }
};

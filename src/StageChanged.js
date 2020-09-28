const { Execution } = require("./db/Execution");

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));
  await Execution.update({
    ExecutionId: event["execution-id"],
    Type: "STAGE",
    Status: event.state,
    TypeId: event.stage,
  });
};

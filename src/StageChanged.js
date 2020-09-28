const { Execution } = require("./db/Execution");

exports.handler = async (event) => {
  await Execution.update({
    ExecutionId: event["execution-id"],
    Type: "STAGE",
    Status: event.state,
    TypeId: event.stage,
  });
};

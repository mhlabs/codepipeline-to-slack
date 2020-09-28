const { Entity } = require("dynamodb-toolbox");
const { ExecutionTable } = require("./Table");
const type = "Execution";
const Execution = new Entity({
  name: type,

  attributes: {
    ExecutionId: { partitionKey: true },
    SK: { hidden: true, sortKey: true },
    Status: { type: "string", required: false },
    Pipeline: { type: "string" },
    Order: { type: "number", required: false },
    ChannelId: { type: "string", required: false },
    Type: ["SK", 0],
    TypeId: ["SK", 1],
  },

  table: ExecutionTable,
});

module.exports = {
  Execution,
};

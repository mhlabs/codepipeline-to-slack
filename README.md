# codepipeline-to-slack

AWS SAM App that sends updates of CodePipeline stage transitions to Slack.

![Demo](images/demo.gif)

## Prerequisites

1. Create a [Slack app](https://api.slack.com/authentication/basics) and add a bot user.
2. Configure oauth for bot user and set scopes to `chat:write` and `chat:write.public`
3. Copy the bot user's OAuth token `xoxb-1234...`

## Setup
When installing this app there are two required parameters:
1. SlackToken - your Slack bot's OAuth token
2. SlackChannel - the channel you want to post updates to

## Customisation
If you are not happy with the default Emojis you can optionally change them to any emoji installed on your workspace
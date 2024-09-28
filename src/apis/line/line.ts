import { Elysia, t } from "elysia";
import { defineApi } from "../../defineApi";
import { addEventLog } from "../../eventLog";

const elysia = new Elysia({ prefix: "/line", tags: ["LINE"] }).post(
  "/v2/bot/message/push",
  async ({ body }) => {
    const { messages } = body;
    const sentMessages = messages.map((_, index) => ({
      id: `${Date.now()}${index}`,
      quoteToken: Math.random().toString(36).substring(2, 15),
    }));
    const topic = `line:${body.to}`;
    console.log(topic);
    await addEventLog(topic, "push", { body, sentMessages });
    return {
      sentMessages,
    };
  },
  {
    body: t.Object({
      to: t.String(),
      messages: t.Array(t.Any()),
      notificationDisabled: t.Optional(t.Boolean()),
      customAggregationUnits: t.Optional(t.Array(t.String())),
    }),
    response: t.Object({
      sentMessages: t.Array(
        t.Object({
          id: t.String(),
          quoteToken: t.String(),
        })
      ),
    }),
    detail: { summary: "Send push message" },
  }
);

export const line = defineApi({
  tag: "LINE",
  description:
    "A mock API that implements a subset of the [LINE Messaging API](https://developers.line.biz/en/reference/messaging-api/).",
  elysia,
});

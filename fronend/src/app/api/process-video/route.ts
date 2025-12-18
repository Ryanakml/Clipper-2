import { inngest } from "~/inngest/client";

export async function POST() {
  await inngest.send({
    name: "process-video-events",
    data: {
      s3_key: "test1/input5min.mp4",
    },
  });

  return Response.json({ ok: true });
}

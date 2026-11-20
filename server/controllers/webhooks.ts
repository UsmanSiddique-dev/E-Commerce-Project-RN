import { verifyWebhook } from "@clerk/express/webhooks";
import type { Request, Response } from "express";
import User from "../models/User.model.ts";

export const clerkWebhook = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const user = await User.findOne({
        clerkId: evt.data.id,
      });
      const email = evt.data.email_addresses[0]?.email_address;
      const userData = {
        clerkId: evt.data.id,
        ...(email ? { email } : {}),
        name: evt.data?.first_name + " " + evt.data?.last_name,
        image: evt.data?.image_url,
      };
      if (user) {
        await User.findOneAndUpdate(
          {
            clerkId: evt.data.id,
          },
          userData,
        );
      } else {
        await User.create(userData);
      }
    }
    return res.json({ success: true, message: "Webhook Recieved" });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
};

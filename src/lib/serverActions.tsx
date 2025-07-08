// src/lib/serverActions.ts

"use server";
import { sendMail, compileWelcomeTemplate } from "@/lib/mail";

export const sendEmail = async () => {
  await sendMail({
    to: "smith03office@gmail.com",
    name: "Best-Pro Templates",
    subject: "New client at  Salford Studio,",
    body: compileWelcomeTemplate(
      "Test",
      "https://your-website.vercel.app/admin/dashboard"
    ),
  });
};

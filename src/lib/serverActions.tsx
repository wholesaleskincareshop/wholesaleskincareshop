// src/lib/serverActions.ts

"use server";
import { sendMail, compileWelcomeTemplate } from "@/lib/mail";

export const sendEmail = async () => {
  await sendMail({
    to: "wholesaleskincareshopp@gmail.com",
    name: "Wholesale Skin Care Shop",
    subject: "New client at  Wholesale Skin Care Shop",
    body: compileWelcomeTemplate(
      "Esther",
      "https://www.wholesaleskincareshop.com/admin/dashboard"
    ),
  });
};

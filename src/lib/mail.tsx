import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { newContactMail } from "./templates/newContactMail";

export async function sendMail({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  try {
    const testResult = await transport.verify();
    console.log(testResult);
  } catch (error) {
    console.error({ error });
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: `"Grandiose-Grin" <${SMTP_EMAIL}>`, // Custom sender name
      to,
      subject,
      html: body,
    });
    console.log(sendResult);
  } catch (error) {
    console.log(error);
  }
}

export function compileWelcomeTemplate(name: string, url: string) {
  const template = handlebars.compile(newContactMail);
  const htmlBody = template({
    name: name,
    url: url,
  });
  return htmlBody;
}

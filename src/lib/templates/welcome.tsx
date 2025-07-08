export const welcomeTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Notification</title>
    <style>
      body {
        margin: 0;
        padding: 20px;
        font-family: "Arial", sans-serif;
        background-color: #ffffff;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        margin-top: 50px;
        background-color: #f5f8fc;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .header {
        height: 50px;
        background-color: #f5f8fc;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .header div {
        width: 50px;
        height: 8px;
        background-color: #3c3c3c;
        border-radius: 4px;
      }

      .content {
        padding: 30px;
        text-align: center-;
      }

      .content h1 {
        font-size: 24px;
        margin-bottom: 10px;
        color: #333;
      }

      .content p {
        font-size: 16px;
        margin-bottom: 30px;
        color: #666;
      }

      .login-button {
        background-color: #ff6b35;
        color: #ffffff;
        padding: 12px 25px;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .login-button:hover {
        background-color: #000000;
      }

      .footer {
        background-color: #ff6b35;
        color: #ffffff;
        padding: 15px;
        font-size: 12px;
        text-align: center;
      }

      .footer p {
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div></div>
      </div>
      <div class="content">
        <h1>Hello {{name}},</h1>
        <p>
          You have a new submission by a potential client at CSquared Brands.
          Login to your dashboard to see it.
        </p>
        <a href="{{url}}" class="login-button">Login</a>
      </div>
      <div class="footer">
        <p>548 Market Street PMB 72296, San Francisco, CA 94104</p>
        <p>© 2024 Chrissy Marketing Agency. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>

`;



<img src="https://i.ibb.co/RQ28H2p/banner.png" alt="banner">
<h1 align="center"><img src="./dashboard/images/logo-non-bg.png" width="22px"> Goat Bot - Bot Chat Messenger</h1>

<p align="center">
	<a href="https://nodejs.org/dist/v16.20.0">
		<img src="https://img.shields.io/badge/Nodejs%20Support-16.x-brightgreen.svg?style=flat-square" alt="Nodejs Support v16.x">
	</a>
  <img alt="size" src="https://img.shields.io/github/repo-size/ntkhang03/Goat-Bot-V2.svg?style=flat-square&label=size">
  <img alt="code-version" src="https://img.shields.io/badge/dynamic/json?color=brightgreen&label=code%20version&prefix=v&query=%24.version&url=https://github.com/ntkhang03/Goat-Bot-V2/raw/main/package.json">
  <img alt="visitors" src="https://visitor-badge.laobi.icu/badge?style=flat-square&page_id=ntkhang3.Goat-Bot-V2">
  <img alt="size" src="https://img.shields.io/badge/license-MIT-green?style=flat-square&color=brightgreen">
</p>

- [📝 **Note**](#-note)
- [🚧 **Requirement**](#-requirement)
- [📝 **Tutorial**](#-tutorial)
- [💡 **How it works?**](#-how-it-works)
- [🔔 **How to get notification when there is a new update?**](#-how-to-get-notification-when-there-is-a-new-update)
- [🆙 **How to Update**](#-how-to-update)
- [🛠️ **How to create new commands**](#️-how-to-create-new-commands)
- [💭 **Support**](#-support)
- [📚 **Supported Languages in the source code**](#-supported-languages-in-the-source-code)
- [📌 **Common Problems**](#-common-problems)
- [❌ **DO NOT USE THE ORIGINAL UNDERGRADUATE VERSION**](#-do-not-use-the-original-undergraduate-version)
- [📸 **Screenshots**](#-screenshots)
- [✨ **Copyright (C)**](#-copyright-c)
- [📜 **License**](#-license)

<hr>

## 📝 **Note**
- This is a messenger chat bot using a personal account, using an [unofficial API](https://github.com/ntkhang03/fb-chat-api/blob/master/DOCS.md) ([Origin here](https://github.com/Schmavery/facebook-chat-api)).
- It is recommended to use a clone account (one that you are willing to throw away at any time).
- ***I am not responsible for any problems that may arise from using this bot.***

## 🚧 **Requirement**
- Node.js 16.x [Download](https://nodejs.org/dist/v16.20.0) | [Home](https://nodejs.org/en/download/) | [Other versions](https://nodejs.org/en/download/releases/)
- Knowledge of **programming**, JavaScript, Node.js, unofficial Facebook API

## 📝 **Tutorial**
Tutorial has been uploaded on YouTube:
- For mobile phone: [YouTube Tutorial](https://www.youtube.com/watch?v=grVeZ76HlgA)
- For VPS/Windows: [YouTube Tutorial](https://www.youtube.com/watch?v=uCbSYNQNEwY)
  
Summary instructions:
- See [here](https://github.com/ntkhang03/Goat-Bot-V2/blob/main/STEP_INSTALL.md)

## 💡 **How it works?**
- The bot uses the unofficial Facebook API to send and receive messages from the user.
- When there is a `new event` (message, reaction, new user join, user leave chat box, etc.), the bot will emit an event to the `handlerEvents`.
- The `handlerEvents` will handle the event and execute the command:
  - `onStart`:
    - The handler will check if the user `called a command or not`.
    - If yes, it will check if the `user is banned` or if `admin box only mode is turned on`. If not, it will execute the command.
    - Next, it will check the `permission` of the user.
    - Next, it will check if the `countdown` of the command is over or not.
    - Finally, it will execute the command and `log` information to the console.

  - `onChat`:
    - The handler will run `when the user sends a message`.
    - It will check the `permission` of the user.
    - The handler will `execute` the command. If it returns a `function` or `async function`, it will check if the `user is banned` or if `admin box only mode is turned on`. If not, it will call the function.

  - `onFirstChat`:
    - The handler will run `when it gets the first message` from the chat box since the bot started.
    - The way it works is similar to `onChat`.

  - `onReaction`:
    - The handler will run when the user `reacts` to a `message with messageID` set in `GoatBot.onReaction` as follows:
		```javascript
		// example:	
		global.GoatBot.onReaction.set(msg.messageID, {
			messageID: msg.messageID,
			commandName,
			// ... and more
		});
		```
    - The handler will automatically add the method `delete`. If this method is called, it will delete the message from the set.
    - Next, it will check the `permission` of the user and `execute` if the user has permission and `log` information to the console.

  - `onReply`:
    - The handler will run when the user `replies` to a `message with messageID` set in `GoatBot.onReply` as follows:
		```javascript
		// example:
		global.GoatBot.onReply.set(msg.messageID, {
			messageID: msg.messageID,
			commandName,
			// ... and more
		});
		```
    - The handler will automatically add the method `delete`. If this method is called, it will delete the message from the set.
    - Next, it will check the `permission` of the user and `execute` if the user has permission and `log` information to the console.  

  - `onEvent`:
    - The handler will run `when the user has a new event` type `event` (new user join, user leave chat box, change admin box, etc.)
		```javascript
		// example:
		global.GoatBot.onEvent.set(msg.messageID, {
			messageID: msg.messageID,
			commandName,
			// ... and more
		});
		```
		- It will loop through all `onEvent` and get the command determined by the key `commandName` and execute the `onEvent` in that command.
		- If it returns a `function` or `async function`, it will call the function and `log` information to the console.

  - `handlerEvent`:
    - The handler will run `when the user has a new event` type `event` (new user join, user leave chat box, change admin box, etc.)
    - It will get all the eventCommand set in `GoatBot.eventCommands` (scripts placed in the `scripts/events` folder).
    - It will loop through all `eventCommands` and run the `onStart` in that command.
    - If it returns a `function` or `async function`, it will call the function and `log` information to the console.

## 🔔 **How to get notification when there is a new update?**
- Click on the `Watch` button in the upper right corner of the screen, select `Custom`, and then select `Pull requests` and `Releases`. Click `Apply` to get notified when there is a new update.

## 🆙 **How to Update**
Tutorial has been uploaded on YouTube:
- On phone/repl: [YouTube Tutorial](https://youtu.be/grVeZ76HlgA?t=1342)
- On vps/computer: [YouTube Tutorial](https://youtu.be/uCbSYNQNEwY?t=508)

## 🛠️ **How to create new commands**
- See [here](https://github.com/ntkhang03/Goat-Bot-V2/blob/main/DOCS.md)

## 💭 **Support**
If you have major coding issues with this bot, please join and ask for help:
- [Discord (recommended)](https://discord.com/invite/DbyGwmkpVY)
- [Facebook Group](https://www.facebook.com/groups/goatbot)
- [Messenger](https://m.me/j/Abbq0B-nmkGJUl2C)
- ~~Telegram (no longer supported)~~
- ***Please do not inbox me. I do not respond to private messages. Any questions, please join the chat group for answers. Thank you!***

## 📚 **Supported Languages in the source code**
- Currently, the bot supports 2 languages:
- [x] `en: English`
- [x] `vi: Vietnamese`

- Change the language in the `config.json` file.
- You can customize the language in the folder `languages/`, `languages/cmds/`, and `languages/events/`.

## 📌 **Common Problems**
<details>
	<summary>
		📌 Error 400: redirect_uri_mismatch
	</summary>
	<p><img src="https://i.ibb.co/6Fbjd4r/image.png" width="250px"></p> 
	<p>1. Enable Google Drive API: <a href="https://youtu.be/nTIT8OQeRnY?t=347">Tutorial</a></p>
	<p>2. Add URI <a href="https://developers.google.com/oauthplayground">https://developers.google.com/oauthplayground</a> (not <a href="https://developers.google.com/oauthplayground/">https://developers.google.com/oauthplayground/</a>)</p>
	<p>3. Choose <b>https://www.googleapis.com/auth/drive</b> and <b>https://mail.google.com/</b> in <b>OAuth 2.0 Playground</b>: <a href="https://youtu.be/nTIT8OQeRnY?t=600">Tutorial</a></p>
</details>

<details>
	<summary>
		📌 Error for site owners: Invalid domain for site key
	</summary>
	<p><img src="https://i.ibb.co/2gZttY7/image.png" width="250px"></p>
	<p>1. Go to <a href="https://www.google.com/recaptcha/admin">https://www.google.com/recaptcha/admin</a></p>
	<p>2. Add domain <b>repl.co</b> (not <b>repl.com</b>) to <b>Domains</b> in <b>reCAPTCHA v2</b>: <a href="https://youtu.be/nTIT8OQeRnY?t=698">Tutorial</a></p>
</details>

<details>
	<summary>
		📌 GaxiosError: invalid_grant, unauthorized_client 
	</summary>
	<p><img src="https://i.ibb.co/n7w9TkH/image.png" width="250px"></p>
	<p><img src="https://i.ibb.co/XFKKY9c/image.png" width="250px"></p>
	<p><img src="https://i.ibb.co/f4mc5Dp/image.png" width="250px"></p>
	<p>- If you don't publish the project in Google console, the refresh token will expire after 1 week and you need to get it back: <a href="https://youtu.be/nTIT8OQeRnY?t=445">Tutorial</a></p>
</details>

<details>
	<summary>
		📌 GaxiosError: invalid_client
	</summary>
	<p><img src="https://i.ibb.co/st3W6v4/Pics-Art-01-01-09-10-49.jpg" width="250px"></p>
	<p>- Check if you have entered your Google project client_id correctly: <a href="https://youtu.be/nTIT8OQeRnY?t=509">Tutorial</a></p>
</details>

<details>
	<summary>
		📌 Error 403: access_denied
	</summary>
	<p><img src="https://i.ibb.co/dtrw5x3/image.png" width="250px"></p>
	<p>- If you don't publish the project in Google console, only the approved accounts added to the project can use it: <a href="https://youtu.be/nTIT8OQeRnY?t=438">Tutorial</a></p>
</details>

## ❌ **DO NOT USE THE ORIGINAL UNDERGRADUATE VERSION**
- The use of unknown source code can lead to the device being infected with viruses, malware, hacked social accounts, banks, etc.
- Goat-Bot-V2 is only published at [GitHub](https://github.com/ntkhang03/Goat-Bot-V2). All other sources, all forks from other GitHub, Replit, etc., are fake and violate policy.
- If you use from other sources (whether accidentally or intentionally), it means that you are in violation and will be banned without notice.

## 📸 **Screenshots**
- ### Bot
<details>
	<summary>
 		Rank system
	</summary>

  - Rank card:
  <p><img src="https://i.ibb.co/d0JDJxF/rank.png" width="399px"></p>

  - Rankup notification:
  <p><img src="https://i.ibb.co/WgZzthH/rankup.png" width="399px"></p>

  - Custom rank card:
  <p><img src="https://i.ibb.co/hLTThLW/customrankcard.png" width="399px"></p>
</details>

<details>
	<summary>
 		Weather
	</summary>
	<p><img src="https://i.ibb.co/2FwWVLv/weather.png" width="399px"></p>
</details>

<details>
	<summary>
 		Auto send notification when a user joins or leaves the chat box (you can customize the message)
	</summary>
	<p><img src="https://i.ibb.co/Jsb5Jxf/wcgb.png" width="399px"></p>
</details>

<details>
	<summary>
 		Openjourney
	</summary>
	<p><img src="https://i.ibb.co/XJfwj1X/Screenshot-2023-05-09-22-43-58-630-com-facebook-orca.jpg" width="399px"></p>
</details>

<details>
	<summary>
 		GPT
	</summary>
	<p><img src="https://i.ibb.co/D4wRbM3/Screenshot-2023-05-09-22-47-48-037-com-facebook-orca.jpg" width="399px"></p>
	<p><img src="https://i.ibb.co/z8HqPkH/Screenshot-2023-05-09-22-47-53-737-com-facebook-orca.jpg" width="399px"></p>
	<p><img src="https://i.ibb.co/19mZQpR/Screenshot-2023-05-09-22-48-02-516-com-facebook-orca.jpg" width="399px"></p>
</details>

- ### Dashboard
<details>
	<summary>
 		Home
	</summary>
	<p><img src="https://i.postimg.cc/GtwP4Cqm/Screenshot-2023-12-23-105357.png" width="399px"></p>
	<p><img src="https://i.postimg.cc/MTjbZT0L/Screenshot-2023-12-23-105554.png" width="399px"></p>
</details>

<details>
	<summary>
 		Stats
	</summary>
	<p><img src="https://i.postimg.cc/QtXt98B7/image.png" width="399px"></p>
</details>

<details>
	<summary>
 		Login/Register
	</summary>
	<p><img src="https://i.postimg.cc/Jh05gKsM/Screenshot-2023-12-23-105743.png" width="399px"></p>
	<p><img src="https://i.postimg.cc/j5nM9K8m/Screenshot-2023-12-23-105748.png" width="399px"></p>
</details>

<details>
	<summary>
 		Dashboard Thread
	</summary>
	<p><img src="https://i.postimg.cc/RF237v1Z/Screenshot-2023-12-23-105913.png" width="399px"></p>
</details>

<details>
	<summary>
 		Custom on/off
	</summary>
	<p><img src="https://i.ibb.co/McDRhmX/image.png" width="399px"></p>
</details>

<details>
	<summary>
 		Custom welcome message (similar with leave, rankup (coming soon), custom command (coming soon))
	</summary>
	<p><img src="https://i.ibb.co/6ZrQqc1/image.png" width="399px"></p>
	<p><img src="https://i.ibb.co/G53JsXm/image.png" width="399px"></p>
</details>

## ✨ **Copyright (C)**
- **[NTKhang (NTKhang03)](https://github.com/ntkhang03)**

## 📜 **License**

**VIETNAMESE**

- ***Nếu bạn vi phạm bất kỳ quy tắc nào, bạn sẽ bị cấm sử dụng dự án của tôi***
- Không bán mã nguồn của tôi
- Không tự xưng là chủ sở hữu của mã nguồn của tôi
- Không kiếm tiền từ mã nguồn của tôi (chẳng hạn như: mua bán lệnh, mua bán/cho thuê bot, kêu gọi quyên góp, v.v.)
- Không xóa/sửa đổi credit (tên tác giả) trong mã nguồn của tôi


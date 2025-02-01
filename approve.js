const fs = require("fs");
const approvedDataPath = "threadApproved.json";
const unapprovedDataPath = "threadUnapproved.json";

module.exports = {
  config: {
    name: "approve",
    author: "ArYAN || Jayden", //don't change my credit
    countDown: 0,
    role: 2,
    category: "admin",
    shortDescription: {
      en: "Approve Unapproved Groups Chats",
    },
  },

  onLoad: async function () {
    if (!fs.existsSync(approvedDataPath)) {
      fs.writeFileSync(approvedDataPath, JSON.stringify([]));
    }
    if (!fs.existsSync(unapprovedDataPath)) {
      fs.writeFileSync(unapprovedDataPath, JSON.stringify([]));
    }
  },

  onStart: async function ({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    const command = args[0] || "";
    const idToApprove = args[1] || threadID;

    let approvedData = JSON.parse(fs.readFileSync(approvedDataPath));
    let unapprovedData = JSON.parse(fs.readFileSync(unapprovedDataPath));

    if (command === "list") {
      let msg = "🔎 𝗔𝗽𝗽𝗿𝗼𝘃𝗲 𝗟𝗶𝘀𝘁\n━━━━━━━━━━\n\nHere Is approved groups list\n";
      for (let index = 0; index < approvedData.length; index++) {
        const groupId = approvedData[index];
        const threadInfo = await api.getThreadInfo(groupId);
        const groupName = threadInfo.name || "Unnamed Group";
        msg += `━━━━━━━[ ${index + 1} ]━━━━━━━\nℹ 𝗡𝗮𝗺𝗲 \n➤ ${groupName}\n🆔 𝗜𝗗\n➤ ${groupId}\n━━━━━━━━━━━━━━━━\n`;
      }
      api.sendMessage(msg, threadID, messageID);
    } else if (command === "del") {
      if (!isNumeric(idToApprove)) {
        api.sendMessage("⛔|𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗜𝗗\n━━━━━━━━━━\n\nInvalid number or tid please check your group number.", threadID, messageID);
        return;
      }

      if (!approvedData.includes(idToApprove)) {
        api.sendMessage(
          "⛔|𝗡𝗼 𝗗𝗮𝘁𝗮\n━━━━━━━━━━\n\nThe group was not approved before!",
          threadID,
          messageID
        );
        return;
      }

      approvedData = approvedData.filter((e) => e !== idToApprove);
      fs.writeFileSync(approvedDataPath, JSON.stringify(approvedData, null, 2));

      api.sendMessage(
        `✅|𝗥𝗲𝗺𝗼𝘃𝗲𝗱\n\nGroup ${idToApprove} has been removed from the approval list.`,
        threadID,
        messageID
      );
    } else if (command === "approveall") {
      for (const groupId of unapprovedData) {
        if (!approvedData.includes(groupId)) {
          approvedData.push(groupId);

          // Send approval message to the group
          const userName = (await api.getUserInfo(senderID))[senderID].name;
          const userID = event.senderID;
          const userFbLink = `https://www.facebook.com/${userID}`;
          const approvalTime = new Date().toLocaleTimeString();
          const approvalDate = new Date().toLocaleDateString();
          const approvalCount = approvedData.length;

          const approvalMessage = `✅|𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱\n━━━━━━━━━━\n\nYour group has been approved by ${userName}\n🔎 𝗔𝗰𝘁𝗶𝗼𝗻 𝗜𝗗 ${userID}\n🔗 𝗟𝗶𝗻𝗸 ${userFbLink}\n🕒 𝗧𝗶𝗺𝗲 ${approvalTime}\n📅 𝗗𝗮𝘁𝗲 ${approvalDate}\n📊 𝗧𝗼𝘁𝗮𝗹 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗚𝗿𝗼𝘂𝗽𝘀 ${approvalCount}`;

          api.sendMessage(approvalMessage, groupId);

          // Send Approval message to Admin
          const adminID = "61560050885709"; // Replace with your Admin ID
          api.sendMessage(`✅|𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱\n━━━━━━━━━━\n\nGroup ${groupId} has been approved successfully by ${userName}`, adminID);
        }
      }

      unapprovedData = [];
      fs.writeFileSync(approvedDataPath, JSON.stringify(approvedData, null, 2));
      fs.writeFileSync(unapprovedDataPath, JSON.stringify(unapprovedData, null, 2));

      api.sendMessage(`✅|𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗔𝗹𝗹\n\nAll unapproved groups have been approved.`, threadID, messageID);
    } else if (!isNumeric(idToApprove)) {
      api.sendMessage("⛔|𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗜𝗗\n━━━━━━━━━━\n\nInvalid Group UID please check your group uid", threadID, messageID);
    } else if (approvedData.includes(idToApprove)) {
      api.sendMessage(
        `✅|𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗕𝗲𝗳𝗼𝗿𝗲\n\nGroup ${idToApprove} was approved before! `,
        threadID,
        messageID
      );
    } else {
      // Approve the group
      approvedData.push(idToApprove);
      fs.writeFileSync(approvedDataPath, JSON.stringify(approvedData, null, 2));

      // Send approval message to the group
      const userName = (await api.getUserInfo(senderID))[senderID].name;
      const userID = event.senderID;
      const userFbLink = `https://www.facebook.com/${userID}`;
      const approvalTime = new Date().toLocaleTimeString();
      const approvalDate = new Date().toLocaleDateString();
      const approvalCount = approvedData.length;

      const approvalMessage = `✅|𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱\n━━━━━━━━━━\n\nYour group has been approved by ${userName}\n🔎 𝗔𝗰𝘁𝗶𝗼𝗻 𝗜𝗗 ${userID}\n🔗 𝗟𝗶𝗻𝗸 ${userFbLink}\n🕒 𝗧𝗶𝗺𝗲 ${approvalTime}\n📅 𝗗𝗮𝘁𝗲 ${approvalDate}\n📊 𝗧𝗼𝘁𝗮𝗹 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗚𝗿𝗼𝘂𝗽𝘀 ${approvalCount}`;

      api.sendMessage(approvalMessage, idToApprove);

      // Send Approval message to Admin
      const adminID = "61560050885709"; // Replace with your Admin ID
      api.sendMessage(`✅|𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱\n━━━━━━━━━━\n\nGroup ${idToApprove} has been approved successfully by ${userName}`, adminID);
    }
  },
};

function isNumeric(value) {
  return /^-?\d+$/.test(value);
      }

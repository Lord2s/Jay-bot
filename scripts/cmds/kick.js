module.exports = {
    config: {
        name: "kick",
        version: "1.3",
        author: "NTKhang",
        countDown: 5,
        role: 1,
        description: {
            vi: "Kick thành viên khỏi box chat",
            en: "Kick member out of chat box"
        },
        category: "box chat",
        guide: {
            vi: "   {pn} @tags: dùng để kick những người được tag",
            en: "   {pn} @tags: use to kick members who are tagged"
        }
    },

    langs: {
        vi: {
            needAdmin: "Vui lòng thêm quản trị viên cho bot trước khi sử dụng tính năng này",
            kickError: "Không thể kick thành viên: {name}. Vui lòng thử lại sau.",
            kickSuccess: "Đã kick thành công thành viên: {name}."
        },
        en: {
            needAdmin: "Please add admin for bot before using this feature",
            kickError: "Unable to kick member: {name}. Please try again later.",
            kickSuccess: "Successfully kicked member: {name}."
        }
    },

    onStart: async function ({ message, event, args, threadsData, api, getLang }) {
        const adminIDs = await threadsData.get(event.threadID, "adminIDs");
        if (!adminIDs.includes(api.getCurrentUserID())) {
            return message.reply(getLang("needAdmin"));
        }

        async function kickAndCheckError(uid, name) {
            try {
                await api.removeUserFromGroup(uid, event.threadID);
                message.reply(getLang("kickSuccess", { name }));
            } catch (e) {
                message.reply(getLang("kickError", { name }));
                return "ERROR";
            }
        }

        if (!args[0]) {
            if (!event.messageReply) {
                return message.SyntaxError();
            }
            const name = event.messageReply.senderName;
            await kickAndCheckError(event.messageReply.senderID, name);
        } else {
            const uids = Object.keys(event.mentions);
            if (uids.length === 0) {
                return message.SyntaxError();
            }
            const names = Object.values(event.mentions);
            if (await kickAndCheckError(uids.shift(), names.shift()) === "ERROR") {
                return;
            }
            for (const [index, uid] of uids.entries()) {
                await kickAndCheckError(uid, names[index]);
            }
        }
    }
};

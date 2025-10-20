const express = require("express");
const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Events } = require("discord.js");
require("dotenv").config();

const app = express();
app.get("/", (req, res) => res.send("Bot is alive!"));
app.listen(3000, () => console.log("🌐 Express server is running..."));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const CHANNEL_INFO = "1426881896293339187";
const CHANNEL_PERM = "1426881903155347486";

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!setupban" && message.member.permissions.has("Administrator")) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Triggers" })
      .setDescription(
        "**📢 قسم الباندات الخاص بالسيرفر**\n\n" +
        "يمكنك استخدام الزر أدناه لإنشاء باند جديد.\n\n" +
        "**[⚠️] Notice:**\n" +
        "استخدم فقط في حال تم التحقق من جميع الأدلة."
      )
      .setImage("https://media.discordapp.net/attachments/1426881739552325712/1427248288188469369/BannerAttack.webp?ex=68f7668c&is=68f6150c&hm=1ae8fa7e262e52d5d901e66492c5ed8b0015c57ae12e05606565f278545f655b&=&format=webp&width=969&height=544")
      .setColor("Red");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("create_ban").setLabel("Create Ban").setStyle(ButtonStyle.Danger)
    );

    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === "create_ban") {
    const modal = new ModalBuilder().setCustomId("ban_modal").setTitle("إنشاء باند جديد");

    const idInput = new TextInputBuilder().setCustomId("discord_id").setLabel("Discord ID").setStyle(TextInputStyle.Short).setRequired(true);
    const infoInput = new TextInputBuilder().setCustomId("info").setLabel("معلومات الشخص").setStyle(TextInputStyle.Paragraph).setRequired(true);
    const reasonInput = new TextInputBuilder().setCustomId("reason").setLabel("السبب").setStyle(TextInputStyle.Paragraph).setRequired(true);
    const durationInput = new TextInputBuilder().setCustomId("duration").setLabel("المدة").setStyle(TextInputStyle.Short).setRequired(true);
    const proofInput = new TextInputBuilder().setCustomId("proof").setLabel("رابط أو وصف الدليل").setStyle(TextInputStyle.Paragraph).setRequired(true);
    const adminInput = new TextInputBuilder().setCustomId("admin").setLabel("اسم المشرف المنفذ").setStyle(TextInputStyle.Short).setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(idInput),
      new ActionRowBuilder().addComponents(infoInput),
      new ActionRowBuilder().addComponents(reasonInput),
      new ActionRowBuilder().addComponents(durationInput),
      new ActionRowBuilder().addComponents(proofInput),
      new ActionRowBuilder().addComponents(adminInput)
    );

    await interaction.showModal(modal);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === "ban_modal") {
    const id = interaction.fields.getTextInputValue("discord_id");
    const info = interaction.fields.getTextInputValue("info");
    const reason = interaction.fields.getTextInputValue("reason");
    const duration = interaction.fields.getTextInputValue("duration");
    const proof = interaction.fields.getTextInputValue("proof");
    const admin = interaction.fields.getTextInputValue("admin");

    const infoChannel = await client.channels.fetch(CHANNEL_INFO);
    const permChannel = await client.channels.fetch(CHANNEL_PERM);

    await infoChannel.send({
      content: `<@${id}>\n\n**📋 معلومات الشخص:**\n${info}\n\n**🚫 السبب:**\n${reason}\n\n**⏱️ المدة:**\n${duration}\n\n**👮 المشرف المسؤول:**\n${admin}\n\n📎 **الدليل:**\n${proof}`,
    });

    await permChannel.send({
      content: `<@${id}>\n\n**📋 معلومات الشخص:**\n${info}\n\n**🚫 السبب:**\n${reason}\n\n**👮 المشرف المسؤول:**\n${admin}\n\n📎 **الدليل:**\n${proof}\n\n🔴 **Status:** Banned Perm`,
    });

    await interaction.reply({ content: "✅ تم إرسال الباند بنجاح!", ephemeral: true });
  }
});

client.login(process.env.TOKEN);

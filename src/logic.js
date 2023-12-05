bot.on(message('text'), async (ctx) => {
    ctx.session ??= INITIAL_SESSION
    try {
      await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'))
      await processTextToChat(ctx, ctx.message.text)
    } catch (e) {
      console.log(`Error while voice message`, e.message)
    }
  })
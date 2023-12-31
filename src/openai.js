import { Configuration, OpenAIApi } from 'openai'
import config from 'config'
import { createReadStream } from 'fs'

export const INITIAL_SESSION = {
    messages: [],
}
export async function initCommand(ctx) {
    ctx.session = INITIAL_SESSION
    await ctx.reply('Жду вашего голосового или текстового сообщения')
}
export async function processTextToChat(ctx, content) {
    try {
      // пушим сообщения пользователя в сессию (в контекст)
      ctx.session.messages.push({ role: openai.roles.USER, content })
      // пушим сообщения бота в сессию (в контекст)
      const response = await openai.chat(ctx.session.messages)
      ctx.session.messages.push({
        role: openai.roles.ASSISTANT,
        content: response.content,
      })
      await ctx.reply(response.content)
    } catch (e) {
      console.log('Error while proccesing text to gpt', e.message)
    }
  }

class OpenAI {
  roles = {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: 'system',
  }
  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey,
    })
    this.openai = new OpenAIApi(configuration)
  }
  async chat(messages) {
    try {
        const response = await this.openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          // model: 'gpt-4',
          messages,
        })
        return response.data.choices[0].message
      } catch (e) {
        console.log('Error while gpt chat', e.message)
      }
  }
  async transcription(filepath) {
    try {
        const response = await this.openai.createTranscription(
          createReadStream(filepath),
          'whisper-1'
        )
        return response.data.text
      } catch (e) {
        console.log('Error while transcription', e.message)
      }
  }
}
export const openai = new OpenAI(config.get('OPENAI_KEY'))
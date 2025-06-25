import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ClaudeService {
  private readonly apiKey = process.env.CLAUDE_API_KEY ?? '';
  private readonly prompt = readFileSync(
    join(__dirname, '../claudePrompt.md'),
    'utf8',
  );

  async generatePoemFromImage(image: string): Promise<string> {
    const res = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: this.prompt },
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
            ],
          },
        ],
      },
      {
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
      },
    );
    return res.data?.content?.[0]?.text ?? '';
  }
}

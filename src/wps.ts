import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from '@langchain/core/prompts';

class WordsPerSentence {
  charset: string;
  chain: any;

  constructor(charset: string) {
    this.charset = charset;  // Define the charset used for the binary conversion

    // Create a more specific and clear prompt for the AI
    const charsetPrompt = this.charset.split('').map((char, index) => `"${char}" at index ${index + 1}`).join(', ');
    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an AI tasked with generating text. Each sentence must exactly contain a specified number of words, corresponding to the indices in a charset. A full stop at the end of each sentence does not count as a word. The charset includes: ${charsetPrompt}. Responses should be formatted as JSON objects with the key "cover_text", containing text that adheres strictly to these word counts.`
      ],
      [
        "human",
        "Create text where each sentence ends with a full stop that does not count as a word and has exactly the number of words as specified by the following list: ${wordCounts}."
      ]
    ]);

    // Set up the AI model with configuration
    this.chain = promptTemplate.pipe( new ChatOpenAI({
  model: "gpt-4-turbo",
  temperature: 0,
}));
  }

  async generateCoverText(wordCounts: number[]): Promise<string> {
    try {
      const result = await this.chain.invoke({ wordCounts: wordCounts.join(', ') });
      const sentences = JSON.parse(result.content).cover_text;
      return sentences
    } catch (error) {
      console.error('Error generating cover text:', error);
      return '';
    }
  }

  async encode(secretMessage: string): Promise<string> {
    const wordCounts = secretMessage.split('').map(char => {
      const index = this.charset.indexOf(char);
      if (index === -1) {
        throw new Error(`Character '${char}' is not in the charset.`);
      }
      return index + 1;  // +1 for zero-based index adjustment
    });

    //console.log("Word Counts: ", wordCounts); // Optionally log the word counts for debugging

    const coverText = await this.generateCoverText(wordCounts);
    return coverText;
  }

  decode(text: string): string {
    const sentences = text.split('. ');
    let decodedMessage = '';

    sentences.forEach(sentence => {
      const words = sentence.trim().split(' ');
      const index = words.length - 1;
      if (index >= 0 && index < this.charset.length) {
        decodedMessage += this.charset[index];
      }
    });

    return decodedMessage;
  }
}

export default WordsPerSentence;

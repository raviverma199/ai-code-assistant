import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

interface judege0Params {
  source_code: string;
  language: string;
  input?: string;
}

export class judege0Service {
  private static readonly apiCreate = 'https://api.paiza.io/runners/create';
  private static readonly apiDetails = 'https://api.paiza.io/runners/get_details';
  private static readonly apiKey = process.env.apikey || 'guest';

  public static async runCode({source_code,language,input = ''}: judege0Params): Promise<string> {
    try {
      const createRes = await axios.post(judege0Service.apiCreate, {
        source_code,
        language: language.toLowerCase(),
        input,
        longpoll: true,
        api_key: judege0Service.apiKey,
      });

      const { id } = createRes.data;
      if (!id) throw new Error('No ID returned from Paiza API');

      let outputData;
      let tries = 0;

      // Retry polling a few times just in case
      while (tries < 5) {
        const detailsRes = await axios.get(judege0Service.apiDetails, {
          params: {
            id,
            api_key: judege0Service.apiKey,
          },
        });

        outputData = detailsRes.data;
        if (outputData.status === 'completed') break;

        await new Promise((res) => setTimeout(res, 1000)); // wait 1s
        tries++;
      }

      const { stdout, stderr, build_stderr } = outputData;

      if (stderr) return `Runtime Error:\n${stderr}`;
      if (build_stderr) return `Build Error:\n${build_stderr}`;
      if (stdout) return stdout.trim() || 'No output';
      return '✅ No output';
    } catch (error: any) {
      console.error('Execution failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to run code');
    }
  }
}

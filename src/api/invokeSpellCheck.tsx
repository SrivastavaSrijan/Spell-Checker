import textgears from 'textgears-api';

const textgearsApi: ITextgearsApi = textgears(process.env.API_AUTH, {
    language: 'en-US',
});
export interface TextGearsResponse {
    response: {
        errors: [
            {
                bad: string;
                better: string[];
                description: { [key: string]: string };
                id: string;
                length: number;
                offset: number;
                type: string;
                result: boolean;
                status: boolean;
            },
        ];
    };
}

export interface SpellCheckData {
    word: string;
    suggestions: string[];
    description: string;
    length: number;
    offset: number;
    type: string;
}
const validateText = (textEntered) => textEntered !== '';
/** Calls the API to check if given text is grammatically & syntatically correct
 * @param text, @param isPassing
 */
export const invokeSpellCheck = (
    textEntered: string,
): Promise<void | SpellCheckData[]> => {
    const formattedText = textEntered.replaceAll('LINE_BREAK', '');
    if (!validateText(formattedText))
        return new Promise((resolve) => resolve([]));
    const spellCheckReturn: SpellCheckData[] = [];
    return textgearsApi
        .checkGrammar(formattedText)
        .then((data: TextGearsResponse) => {
            for (const error of data?.response?.errors) {
                const {
                    length,
                    offset,
                    type,
                    description: { en },
                } = error;
                console.log(
                    'Error: %s. Suggestions: %s',
                    error.bad,
                    error.better.join(', '),
                );
                spellCheckReturn.push({
                    word: error.bad,
                    suggestions: error.better,
                    description: en,
                    length,
                    offset,
                    type,
                });
            }
        })
        .then(() => spellCheckReturn)
        .catch((err) => {
            console.error('API Error', err);
        });
};

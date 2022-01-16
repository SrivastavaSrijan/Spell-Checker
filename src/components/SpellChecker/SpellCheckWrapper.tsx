import React, {
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import { invokeSpellCheck, SpellCheckData } from '../../api/invokeSpellCheck';
import { AsyncResponse, useAsync } from '../../hook/useAsync';
import { IncorrectWordData } from '../../App';
interface SpellCheckWrapperProps {
    text: string;
    setIncorrectWords: Dispatch<SetStateAction<IncorrectWordData>>;
    children: unknown;
}

/**
 * Spell Checker Dropdown which displays the correct usage of words entered as input
 * @interface SpellCheckDropdownProp
 */
const SpellCheckWrapper: FC<SpellCheckWrapperProps> = (
    prop: SpellCheckWrapperProps,
) => {
    const [suggestions, setSuggestions]: [
        JSX.Element[],
        Dispatch<SetStateAction<JSX.Element[]>>,
    ] = useState([]);

    const { text, setIncorrectWords, children } = prop;
    const { response, isLoading, hasError }: AsyncResponse = useAsync(
        invokeSpellCheck,
        [text],
    );
    const createSpellCheckerDropdown = (spellCheckResponse: SpellCheckData[]) =>
        spellCheckResponse?.map((response: SpellCheckData) => (
            <span key={response.offset}>{response.word}</span>
        ));
    const generateIncorrectWords = (
        spellCheckResponse: SpellCheckData[],
    ): IncorrectWordData => {
        const wrongWordsData: IncorrectWordData =
            spellCheckResponse?.reduce(
                (acc, value: SpellCheckData) => ({
                    ...acc,
                    [value.word.trim()]: value,
                }),
                {},
            ) ?? {};
        return wrongWordsData;
    };
    useEffect(() => {
        const spellCheckResponse = response as SpellCheckData[];
        setSuggestions(createSpellCheckerDropdown(spellCheckResponse));
        const incorrectWords = generateIncorrectWords(spellCheckResponse);
        setIncorrectWords(incorrectWords);
        return () => {
            console.log('Done re-render of SpellCheckWrapper.tsx');
        };
    }, [response, setIncorrectWords]);
    return (
        <>
            {children}
            <div className="flex-spellcheck-container">
                {hasError ? (
                    'Failed to load spell checking API'
                ) : isLoading ? (
                    <div className="spinner-container">
                        <svg
                            className="spinner"
                            role="alert"
                            aria-live="assertive"
                        >
                            <circle cx="30" cy="30" r="20" className="circle" />
                        </svg>
                    </div>
                ) : (
                    suggestions
                )}
            </div>
        </>
    );
};

export default SpellCheckWrapper;

import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import './styles.scss';
import { onInputHandler, preserveLineBreak } from './hook/setInputHandlers';
import SpellCheckWrapper from './components/SpellChecker/SpellCheckWrapper';
import { Edit, useEditable } from 'use-editable';
import { SpellCheckData } from './api/invokeSpellCheck';
import SpellCheckIncorrectWord from './components/SpellChecker/SpellCheckIncorrectWord';
export interface IncorrectWordData {
    [key: string]: SpellCheckData;
}
const App: React.FC = () => {
    const [text, setText]: [string, Dispatch<SetStateAction<string>>] =
        useState('');
    const [incorrectWords, setIncorrectWords]: [
        IncorrectWordData,
        Dispatch<SetStateAction<IncorrectWordData>>,
    ] = useState({});
    const incorrectWordsList = useRef([] as string[]);
    const formatText = (text: string) =>
        text.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    useEffect(() => {
        incorrectWordsList.current = Object.keys(incorrectWords);
        return () => {
            console.log('Done re-render of App.tsx');
        };
    }, [incorrectWords]);
    const editorRef = useRef(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const editFunctions: Edit = useEditable(editorRef, setText);
    return (
        <div className="wrapper">
            <h1>Spellchecker Component</h1>
            <SpellCheckWrapper
                text={text}
                setIncorrectWords={setIncorrectWords}
            >
                <div
                    ref={editorRef}
                    onInput={onInputHandler}
                    onKeyDown={preserveLineBreak}
                    spellCheck="false"
                    data-edit="true"
                >
                    {/* {text.split(/\r?\n/).map((content, i, arr) => ( */}
                    <React.Fragment>
                        {text
                            ?.match(/\b((\w+)'?(\w+)?(\W+))/g)
                            ?.map((wordMatched: string, j) =>
                                Object.keys(incorrectWords).includes(
                                    formatText(wordMatched),
                                ) ? (
                                    <SpellCheckIncorrectWord
                                        key={j}
                                        word={wordMatched}
                                        payload={
                                            incorrectWords[
                                                formatText(wordMatched)
                                            ]
                                        }
                                    />
                                ) : (
                                    <span key={j} className="correct">
                                        {wordMatched}
                                    </span>
                                ),
                            )}
                    </React.Fragment>
                    {/* ))} */}
                </div>
            </SpellCheckWrapper>
        </div>
    );
};

export default App;

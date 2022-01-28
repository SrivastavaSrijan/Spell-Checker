import React, {
    Dispatch,
    SetStateAction,
    FormEvent,
    MouseEvent,
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
import { ContextMenuTrigger } from 'react-contextmenu';
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
    const editFunctions: Edit = useEditable(editorRef, setText);

    const removeStylesAndUpdate = (event: FormEvent<HTMLSpanElement>) => {
        const { classList } = event.target as HTMLElement;
        classList.remove(...classList.values());
    };
    const selectStyles = (type: string) => {
        switch (type) {
            case 'spelling':
                return 'spelling-error';
            case 'grammar':
                return 'grammar-error';
            case 'style':
                return 'lingo-error';
        }
    };

    const onContextMenu = (event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
    };
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
                    <React.Fragment>
                        {text
                            ?.match(/\b((\w+)'?(\w+)?(\W+))/g)
                            ?.map((wordMatched: string, j) =>
                                Object.keys(incorrectWords).includes(
                                    formatText(wordMatched),
                                ) ? (
                                    <ContextMenuTrigger
                                        id={wordMatched + j}
                                        renderTag="span"
                                        holdToDisplay={200}
                                    >
                                        <span
                                            className={`incorrect-word ${selectStyles(
                                                incorrectWords[
                                                    formatText(wordMatched)
                                                ].type,
                                            )}`}
                                            id={wordMatched + j}
                                            onInput={removeStylesAndUpdate}
                                            onContextMenu={onContextMenu}
                                        >
                                            {wordMatched}
                                        </span>
                                    </ContextMenuTrigger>
                                ) : (
                                    <span key={j} className="correct">
                                        {wordMatched}
                                    </span>
                                ),
                            )}
                    </React.Fragment>
                </div>
            </SpellCheckWrapper>
            {text
                ?.match(/\b((\w+)'?(\w+)?(\W+))/g)
                ?.map((wordMatched: string, j) =>
                    Object.keys(incorrectWords).includes(
                        formatText(wordMatched),
                    ) ? (
                        <SpellCheckIncorrectWord
                            key={j}
                            word={wordMatched}
                            payload={incorrectWords[formatText(wordMatched)]}
                            index={j}
                            editFunctions={editFunctions}
                        />
                    ) : (
                        ''
                    ),
                )}
        </div>
    );
};

export default App;

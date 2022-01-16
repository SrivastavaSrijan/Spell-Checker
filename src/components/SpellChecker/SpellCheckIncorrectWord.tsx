import React, { FormEvent, MouseEvent } from 'react';
import { SpellCheckData } from '../../api/invokeSpellCheck';

interface SpellCheckIncorrectWordProps {
    word: string;
    payload: SpellCheckData;
}

const SpellCheckIncorrectWord: React.FC<SpellCheckIncorrectWordProps> = (
    props: SpellCheckIncorrectWordProps,
) => {
    const { word, payload } = props;
    const removeStyles = (event: FormEvent<HTMLSpanElement>) => {
        const { classList } = event.target as HTMLElement;
        classList.remove(...classList.values());
    };
    const selectStyles = (type: string) => {
        switch (type) {
            case 'spelling':
                return 'spelling-error';
            case 'grammar':
                return 'grammar-error';
        }
    };

    const onContextMenu = (event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
    };
    return (
        <>
            <span
                className={`incorrect-word ${selectStyles(payload.type)}`}
                onInput={removeStyles}
                onContextMenu={onContextMenu}
            >
                {word}
            </span>
        </>
    );
};

export default SpellCheckIncorrectWord;

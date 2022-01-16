import React, { FormEvent, MouseEvent, TouchEvent, useRef } from 'react';
import { SpellCheckData } from '../../api/invokeSpellCheck';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import useConstant from 'use-constant';

interface SpellCheckIncorrectWordProps {
    word: string;
    payload: SpellCheckData;
}

const SpellCheckIncorrectWord: React.FC<SpellCheckIncorrectWordProps> = (
    props: SpellCheckIncorrectWordProps,
) => {
    const { word, payload } = props;
    const spanToMutate = useRef(null);
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
            case 'style':
                return 'lingo-error';
        }
    };

    const onContextMenu = (event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
    };
    const onContextMenuClick = (
        event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
        data: { wordToReplace: string },
    ) => {
        event.preventDefault();
        const span = spanToMutate.current as HTMLSpanElement;
        span.textContent = data.wordToReplace + ' ';
    };
    const uuid = useConstant(() => word + payload.offset.toString());
    return (
        <span>
            <ContextMenuTrigger id={uuid} renderTag="span" holdToDisplay={200}>
                <span
                    className={`incorrect-word ${selectStyles(payload.type)}`}
                    onInput={removeStyles}
                    onContextMenu={onContextMenu}
                    ref={spanToMutate}
                >
                    {word}
                </span>
            </ContextMenuTrigger>
            <ContextMenu id={uuid}>
                <p>{payload.description}</p>
                <hr />
                {payload.suggestions.length !== 0 ? (
                    payload.suggestions.map(
                        (suggString: string, index: number) => (
                            <MenuItem
                                data={{ wordToReplace: suggString }}
                                key={index}
                                onClick={onContextMenuClick}
                            >
                                {suggString}
                            </MenuItem>
                        ),
                    )
                ) : (
                    <p>No possible sugesstions</p>
                )}
            </ContextMenu>
        </span>
    );
};

export default SpellCheckIncorrectWord;

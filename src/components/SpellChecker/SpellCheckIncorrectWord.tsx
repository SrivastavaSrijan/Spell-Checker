import React, { MouseEvent, TouchEvent } from 'react';
import { SpellCheckData } from '../../api/invokeSpellCheck';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import useConstant from 'use-constant';
import { Edit } from 'use-editable';

interface SpellCheckIncorrectWordProps {
    word: string;
    payload: SpellCheckData;
    index: number;
    editFunctions: Edit;
}

const SpellCheckIncorrectWord: React.FC<SpellCheckIncorrectWordProps> = (
    props: SpellCheckIncorrectWordProps,
) => {
    const { word, payload, index, editFunctions } = props;

    const onContextMenuClick = (
        event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
        data: { wordToReplace: string },
    ) => {
        event.preventDefault();
        const { text } = editFunctions.getState();
        editFunctions.update(text.replace(word, data.wordToReplace + ' '));
    };
    const uuid = useConstant(() => word + index);
    return (
        <span>
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

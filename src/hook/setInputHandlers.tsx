import { FormEvent, KeyboardEvent } from 'react';

export const onInputHandler = (event: FormEvent<HTMLDivElement>) => {
    setExpandableInput(event);
};

export const preserveLineBreak = (ev: KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === 'Enter') {
        document.execCommand('insertLineBreak');
        ev.preventDefault();
    }
};
/** Expands the textarea according to the input text
 * @param target
 * @function onInput
 */
const setExpandableInput = ({ target: elm }) => {
    const getScrollHeight = (elm: {
        value?: string;
        innerHTML?: string;
        _baseScrollHeight: string;
        scrollHeight: string;
    }) => {
        const savedValue = elm?.value ?? elm.innerHTML;
        elm.value = '';
        elm._baseScrollHeight = elm.scrollHeight;
        elm.value = savedValue;
    };
    const minRows = elm.getAttribute('data-min-rows') | 0;
    let rows = null;
    !elm._baseScrollHeight && getScrollHeight(elm);
    elm.rows = minRows;
    rows = Math.ceil((+elm.scrollHeight - +elm._baseScrollHeight) / 16);
    elm.rows = minRows + rows;
};

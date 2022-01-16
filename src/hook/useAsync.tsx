/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
export interface AsyncResponse {
    response: unknown;
    hasError: null | Error;
    isLoading: boolean;
}
export const useAsync = (
    getMethod: (args?) => Promise<unknown>,
    params: string[],
): AsyncResponse => {
    const [response, setValue] = useState(null);
    const [hasError, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const debouncedAPIInvoke = useConstant(() =>
        AwesomeDebouncePromise(getMethod, 1500),
    );
    const getResource = async () => {
        try {
            setTimeout(() => {
                setLoading(true);
            }, 1500);
            const result = await debouncedAPIInvoke(...params);
            setValue(result);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getResource();
    }, params);

    return { response, hasError, isLoading };
};

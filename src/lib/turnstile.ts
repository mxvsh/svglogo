let _token = "";

export const getTurnstileToken = () => _token;
export const setTurnstileToken = (t: string) => { _token = t; };
export const clearTurnstileToken = () => { _token = ""; };

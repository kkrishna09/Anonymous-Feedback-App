// debounce function
export const debounce = <T extends Function>(func: T, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};
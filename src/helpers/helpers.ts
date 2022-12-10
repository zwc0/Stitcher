const clone: <T>(json: T) => T = (json) => JSON.parse(JSON.stringify(json));

const tryParseJson: <T>(json: string) => T | null = (json) => {
    try {
        if (typeof json !== 'string')
            return null;
        return JSON.parse(json);
    }catch(e){
        return null;
    }
}

export {clone, tryParseJson};